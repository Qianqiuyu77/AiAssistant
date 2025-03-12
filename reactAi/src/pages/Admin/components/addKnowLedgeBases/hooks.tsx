import { useState } from 'react';
import { UploadFile, UploadProps, message } from 'antd';
import { previewChunks, uploadImage } from '../../../../api';
import useBaseStore from '../../../../../zustand/baseStore';
import { ChunksData } from '../../../../types/admin';

export const useFileUploader = () => {
    const baseState = useBaseStore();
    const [knowFileList, setKnowFileList] = useState<UploadFile[]>([]); // 统一存储文件
    const [imgFileList, setImgFileList] = useState<UploadFile[]>([]); // 另存图片文件
    const [dataFile, setDataFile] = useState<File>(new File([], ""));
    const [img, setImg] = useState<string>("");

    const clearFile = () => {
        setKnowFileList([]);
        setDataFile(new File([], ""));
        setImgFileList([]);
        setImg("");
    }

    //     // 限制图片格式和大小
    const beforeUpload = (file: File) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

        const isLt2M = file.size / 1024 / 1024 < 2;
        return isJpgOrPng && isLt2M;
    };

    const beforeUploadKnow = (file: File): boolean => {
        const allowedExtensions = ['.txt', '.pdf', '.md', '.html', '.py']; // 允许的扩展名

        // 获取文件扩展名
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

        // 检查文件扩展名是否在允许的类型内
        const isValidExtension = allowedExtensions.includes(fileExtension);

        return isValidExtension;
    };

    const imgProps: UploadProps = {
        fileList: imgFileList,
        onRemove: () => {
            setImgFileList([]);
            setImg("");
        },
        customRequest: async ({ file, onSuccess, onError }) => {
            const formData = new FormData();
            formData.append('image', file);
            if (!beforeUpload(file as File)) {
                message.error('文件格式不正确')
                onError?.(new Error('文件格式不正确'));
                return
            }
            try {
                const res = await uploadImage(baseState.token, formData);
                if (res?.data) {
                    console.log(res.data);
                    setImg(res.data);
                    setImgFileList([file as UploadFile]);
                    message.success('知识库图标上传成功!');
                    onSuccess?.({}, file);
                } else {
                    message.error(res.msg || '知识库图标上传失败!');
                    onError?.(new Error(res.msg || '上传失败'));
                }
            } catch (error) {
                console.error(error);
                message.error('知识库图标上传失败!');
                onError?.(new Error('知识库图标上传失败'));
            }
        }

    };

    const knowProps: UploadProps = {
        fileList: knowFileList,
        customRequest: async ({ file, onSuccess, onError }) => {

            if (!beforeUploadKnow(file as File)) {
                message.error('文件格式不正确')
                onError?.(new Error('文件格式不正确'));
                return
            }
            setDataFile(file as File);
            setKnowFileList([file as UploadFile]);
            onSuccess?.({}, file);
        },
        onRemove: () => {
            setKnowFileList([]);
            setDataFile(new File([], ""));
        },
    }

    return { knowProps, imgProps, dataFile, img, clearFile };
};

export const useTextSplitter = ({
    chunkSize,
    chunkOverlap,
    humanSplit,
    text,
    dataFile
}: {
    chunkSize: number;
    chunkOverlap: number;
    humanSplit: boolean;
    text: string;
    dataFile: File;
}) => {
    const baseState = useBaseStore();
    const [chunksData, setChunksData] = useState<string[]>([]);

    const clearChunksData = () => {
        setChunksData([]);
    };

    const splitText = () => {
        if (!text.trim() && !dataFile?.name) {
            message.warning("请输入内容后再上传");
            return;
        }

        const file = dataFile?.name
            ? dataFile
            : new File([text], "file.txt", { type: "text/plain" });

        fetchPreviewChunks({
            file,
            chunkSize,
            chunkOverlap,
            humanSplit
        });
    };

    async function fetchPreviewChunks(chunksData: ChunksData) {
        try {
            const res = await previewChunks(baseState.token, chunksData);

            if (res?.data?.chunksPreview) {
                setChunksData(res.data.chunksPreview);
            } else {
                message.error(res?.msg || "获取段落信息失败，请重试");
            }
        } catch (err) {
            console.error("Error fetching preview chunks:", err);
            message.error("获取段落信息失败，请重试");
        }
    }

    return {
        chunksData,
        chunkSizeMarks: { [chunkSize]: `${chunkSize}`, 1000: "1000" },
        chunkOverlapMarks: { [chunkOverlap]: `${chunkOverlap}`, 100: "100" },
        splitText,
        fetchPreviewChunks,
        clearChunksData
    };
};
