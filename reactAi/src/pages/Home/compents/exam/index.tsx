import { useEffect, useRef, useState } from 'react';

import './index.scss';
import { Button, Card, message, Progress, Radio, RadioChangeEvent, Result } from 'antd';
import { CloseCircleOutlined, FrownFilled, SmileOutlined } from '@ant-design/icons';
import { comitPaper, getPaper } from '../../../../api';
import { ExamStep, Question } from '../../../../types/exam';
import axios from 'axios';
import useBaseStore from '../../../../../zustand/baseStore';

interface ExamProps {
    conversationId: number;
    setExamclose: () => void;
}


const Exam = (props: ExamProps) => {

    const { token } = useBaseStore();
    const { conversationId, setExamclose } = props;
    const [questionList, setQuestionList] = useState<Question[]>([]);
    // 组件状态
    const [userAnswers, setUserAnswers] = useState<string[]>(Array(questionList.length).fill("A"));
    const [step, setStep] = useState(ExamStep.initStep);
    const [process, setProcess] = useState(0);
    const score = useRef<number>(0);
    const controllerRef = useRef<AbortController | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);



    const onChange = (e: RadioChangeEvent, index: number) => {
        setUserAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[index] = e.target.value;
            return newAnswers;
        })
    };

    const calculateScore = () => {
        if (questionList.length === 0) return 0;
        let score = 0;

        questionList.forEach((item, index) => {
            if (item.answer === userAnswers[index]) {
                score++;
            }
            console.log(item.answer);

        });
        console.log(Math.round((score / questionList.length) * 100));

        return Math.round((score / questionList.length) * 100);
    };

    const onSubmit = () => {
        score.current = calculateScore()
        setStep(ExamStep.resultStep);
        comitPaper(token, conversationId, score.current);
    }

    const onSuccessRetry = () => {
        score.current = 0;
        setStep(ExamStep.initStep);
        setProcess(0);
        getPaperData();
    }

    const onFailRetry = () => {
        score.current = 0;
        setStep(ExamStep.examStep);
    }

    const onBack = () => {
        setStep(ExamStep.answerStep);
    }

    const fetchGetPaper = async (conversationId: number, controller: AbortController) => {
        try {

            const res = await getPaper(token, conversationId, { signal: controller.signal });
            if (res.data) {
                setQuestionList(res.data?.questions || [])
            } else {
                throw new Error("试卷格式有误")
            }

        } catch (err) {
            console.log(err);

            if (axios.isCancel(err)) {
                message.info("生成已被取消");
            } else {
                console.error("获取试卷失败:", err);
                message.error("获取试卷失败");
                throw new Error("获取试卷失败")
            }
        }
    }

    const getPaperData = async () => {

        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // 创建新的 controller 并保存
        const controller = new AbortController();
        controllerRef.current = controller;

        intervalRef.current = setInterval(() => {
            setProcess(prev => {
                if (prev >= 100) {
                    clearInterval(intervalRef.current!);
                    return 100;
                }

                // **计算递增量**
                let increment;
                if (prev < 50) {
                    increment = Math.random() * 7 + 1; // 1% - 8%
                } else if (prev < 80) {
                    increment = Math.random() * 5 + 1; // 1% - 6%
                } else {
                    increment = Math.random() * 1 + 1; // 1% - 2%
                }

                return Math.round(Math.min(prev + increment, 99)); // 最高到 95%
            });
        }, Math.random() * 1000 + 1000); // 每 400-1400ms 触发一次

        // **获取真实试卷数据**
        fetchGetPaper(conversationId, controllerRef.current).then(() => {
            setProcess(100);
            setTimeout(() => setStep(ExamStep.examStep), 1000);
        }).catch(() => {
            setProcess(0);
            setStep(ExamStep.errorStep);
        }).finally(() => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        });
    }

    useEffect(() => {
        if (conversationId === -1) return;

        const cleanup = () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (controllerRef.current) controllerRef.current.abort();
        };

        cleanup(); // 清除之前的请求
        getPaperData();

        return cleanup;
    }, []);

    useEffect(() => {
        setUserAnswers(Array(questionList.length).fill("A"));
    }, [questionList]);


    const style: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    };

    return (
        <Card title="知识点掌握考试" extra={<CloseCircleOutlined onClick={setExamclose} />} >
            {
                step === ExamStep.initStep &&
                <Result
                    icon={<Progress type="dashboard" percent={process} />}
                    title="试卷正在加载中，请稍后"
                />
            }
            {
                step === ExamStep.errorStep &&
                <Result
                    status="warning"
                    title="试卷被风吹走啦，请重新加载吧"
                    extra={
                        <Button onClick={onSuccessRetry}>
                            重新加载
                        </Button>
                    }
                />
            }
            {
                step === ExamStep.examStep && <div className="examContainer">
                    <div className='paperContainer'>
                        {questionList.map(
                            (item, index) =>
                                <div className='questionItem' key={index}>
                                    <div className='questionTitle'>{(index + 1) + ". " + item.stem}</div>
                                    <div className='questionOptions'>
                                        <Radio.Group
                                            style={style}
                                            onChange={(e) => { onChange(e, index) }}
                                            value={userAnswers[index]}
                                            options={[
                                                { value: "A", label: "A. " + item.options.A },
                                                { value: "B", label: "B. " + item.options.B },
                                                { value: "C", label: "C. " + item.options.C },
                                                { value: "D", label: "D. " + item.options.D },
                                            ]}
                                        />
                                    </div>
                                </div>
                        )}
                    </div>

                    <div className='submitBtn'>
                        {
                            <Button style={{ width: 100, height: 40, backgroundColor: 'rgb(93, 101, 248)' }} onClick={onSubmit} type="primary" >
                                提交
                            </Button>
                        }

                    </div>
                </div>
            }
            {
                step === ExamStep.resultStep && (
                    score.current >= 80 ?
                        <Result
                            icon={<SmileOutlined />}
                            title="很棒! 你已经掌握了这些知识点"
                            subTitle={
                                <div >
                                    你的得分是
                                    <span className='score'> {score.current} </span>
                                    分
                                </div>

                            }
                            extra={
                                <>
                                    <Button onClick={onBack} >查看解析</Button>
                                    <Button type="primary" onClick={onSuccessRetry}>再来一次</Button>
                                </>

                            }
                        /> :
                        <Result
                            icon={<FrownFilled />}
                            title="很遗憾! 你还没有掌握这些知识点"
                            subTitle={
                                <div >
                                    你的得分是
                                    <span className='score'>{score.current}  </span>
                                    分
                                </div>
                            }
                            extra={
                                <>
                                    <Button onClick={onBack} >查看解析</Button>
                                    <Button type="primary" onClick={onFailRetry}>再来一次</Button>
                                </>

                            }
                        />
                )
            }
            {
                step === ExamStep.answerStep && <div className="examContainer">
                    <div className='paperContainer'>
                        {questionList.map(
                            (item, index) =>
                                <div className='questionItem' key={index}>
                                    <div className='questionTitle'>{(index + 1) + ". " + item.stem}</div>
                                    <div className='questionOptions'>
                                        <Radio.Group
                                            style={style}
                                            onChange={(e) => { onChange(e, index) }}
                                            value={userAnswers[index]}
                                            disabled
                                            options={[
                                                { value: "A", label: "A. " + item.options.A },
                                                { value: "B", label: "B. " + item.options.B },
                                                { value: "C", label: "C. " + item.options.C },
                                                { value: "D", label: "D. " + item.options.D },
                                            ]}
                                        />
                                    </div>
                                    {
                                        <div className='answerAnalysis'>
                                            <span style={{ color: item.answer === userAnswers[index] ? '#5d65f8' : '#ff4d4f' }}>{"正确答案：[" + item.answer + "]"}</span>
                                            <br />
                                            <span >{"解析：" + item.analysis}</span>
                                        </div>
                                    }



                                </div>

                        )}
                        <div className='againBtn'>
                            <Button style={{ width: 100, height: 40, backgroundColor: 'rgb(93, 101, 248)' }} type="primary" onClick={onSuccessRetry}>再来一次</Button>
                        </div>
                    </div>


                </div>
            }
        </Card>

    );
};

export default Exam;