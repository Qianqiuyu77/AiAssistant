import { MenuProps } from 'antd/es/menu';
import './index.scss'
import { useNavigate } from 'react-router-dom';
import Dropdown, { DropdownProps } from 'antd/es/dropdown';
import { useEffect, useRef, useState } from 'react';
import FeedBackBox from '../feedBackBox';
import ShadowBox from '../shadowBox';
import { bus } from '../../bus';

interface HeaderProps {
    userName: string;
}
const Header = (props: HeaderProps) => {
    const { userName = '' } = props;
    const navigate = useNavigate();

    const [feedBackOpen, setFeedBackOpen] = useState(false);
    const messageIdRef = useRef<number>(0);


    const items: MenuProps["items"] = [
        {
            label: (
                <div
                    className="menuItem"
                    onClick={
                        () => {
                            navigate('/login')
                        }
                    }
                >
                    <img src="src/images/退出.png" />
                    退出登录
                </div>

            ),
            key: "1",
        },
    ];

    const [open, setOpen] = useState(false); // 控制下拉菜单的显示与隐藏

    const handleOpenChange: DropdownProps["onOpenChange"] = (nextOpen, info) => {
        if (info.source === "trigger" || nextOpen) {
            setOpen(nextOpen);
        }
    };

    const openFeedBack = () => {
        setFeedBackOpen(true);
    }

    useEffect(() => {
        bus.on('openFeedBack', (messageId: number) => {
            console.log(messageId);

            messageIdRef.current = messageId;
            openFeedBack()
        })
        return () => {
            bus.off('openFeedBack')
        }
    }, [])

    return (
        <>
            <div className="topBar">
                <div className="logo">
                    <img
                        src="src\images\ai.png"
                        className="topIcon"
                    />
                    <div className="topTitle">
                        计算机智能助教
                    </div>
                </div>
                <div className="functionalBar" >
                    <div className="feedBack" onClick={openFeedBack}>
                        <img src="src/images/意见反馈.png" alt="" />
                        意见反馈
                    </div>
                    <div className="split">|</div>
                    <img
                        src="src/images/太阳.png"
                        alt=""
                        className="functionalIcon"
                    />
                    <img
                        src="src/images/更多.png"
                        alt=""
                        className="functionalIcon"
                    />
                    <Dropdown
                        menu={{ items }}
                        trigger={["click"]}
                        open={open}
                        onOpenChange={handleOpenChange}
                    >
                        <div className="userIcon functionalIcon">
                            {userName.slice(0, 1) || ''}
                        </div>
                    </Dropdown>
                </div>
            </div>
            {
                feedBackOpen &&
                <ShadowBox>
                    <FeedBackBox
                        closeFeedBack={() => setFeedBackOpen(false)}
                        messageId={messageIdRef.current}
                    />
                </ShadowBox>

            }
        </>

    )
}

export default Header