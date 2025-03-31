import { useEffect, useRef, useState } from 'react';

import './index.scss';
import { Button, Card, message, Progress, Radio, RadioChangeEvent, Result } from 'antd';
import { CloseCircleOutlined, MehFilled, SmileOutlined } from '@ant-design/icons';
import { getPaper } from '../../../../api';
import { ExamStep, Question } from '../../../../types/exam';
import axios from 'axios';

interface ExamProps {
    conversationId: number;
    setExamclose: () => void;
}


const Exam = (props: ExamProps) => {
    const { conversationId, setExamclose } = props;
    const [questionList, setQuestionList] = useState<Question[]>([]);
    // 组件状态
    const [userAnswers, setUserAnswers] = useState<string[]>(Array(questionList.length).fill("A"));
    const [submitted, setSubmitted] = useState(false);
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
        });
        console.log(Math.round((score / questionList.length) * 100));

        return Math.round((score / questionList.length) * 100);
    };

    const onSubmit = () => {
        setSubmitted(true);
        score.current = calculateScore()
        setStep(ExamStep.resultStep);
    }

    const onSuccessRetry = () => {
        setSubmitted(false);
        setStep(ExamStep.initStep);
        setProcess(0);
        getPaperData();
    }

    const onFailRetry = () => {
        setSubmitted(false);
        setStep(ExamStep.examStep);
    }

    const onBack = () => {
        setStep(ExamStep.answerStep);
    }

    const fetchGetPaper = async (conversationId: number, controller: AbortController) => {
        try {

            const res = await getPaper(conversationId, { signal: controller.signal });
            if (res.data) {
                setQuestionList(res.data?.questions || [])
            } else {
                message.error(res.msg || "获取试卷失败")
            }

        } catch (err) {
            if (axios.isCancel(err)) {
                message.info("生成已被取消");
            } else {
                console.error("获取试卷失败:", err);
                message.error("获取试卷失败");
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
        fetchGetPaper(conversationId, controllerRef.current).finally(() => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setProcess(100);
            setTimeout(() => setStep(ExamStep.examStep), 1000);
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
    }, [questionList.length]);


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
                step === ExamStep.examStep && <div className="examContainer">
                    {questionList.map(
                        (item, index) =>
                            <div key={index}>
                                <div>{(index + 1) + ". " + item.stem}</div>
                                <div>
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
                                {
                                    submitted && <div>
                                        {
                                            item.answer
                                        }
                                        {
                                            item.analysis
                                        }
                                    </div>
                                }


                            </div>
                    )}
                    <div>
                        {
                            !submitted && <Button onClick={onSubmit} type="primary" >
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
                            extra={
                                <>
                                    <Button onClick={onBack} >查看解析</Button>
                                    <Button type="primary" onClick={onSuccessRetry}>再来一次</Button>
                                </>

                            }
                        /> :
                        <Result
                            icon={<MehFilled />}
                            title="很遗憾! 你还没有掌握这些知识点"
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
                    {questionList.map(
                        (item, index) =>
                            <div key={index}>
                                <div>{(index + 1) + ". " + item.stem}</div>
                                <div>
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
                                    <div>
                                        {
                                            "正确答案：" + item.answer + item.analysis
                                        }
                                    </div>
                                }



                            </div>

                    )}
                    <Button type="primary" onClick={onSuccessRetry}>再来一次</Button>
                </div>
            }
        </Card>

    );
};

export default Exam;