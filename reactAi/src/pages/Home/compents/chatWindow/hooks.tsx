import { useEffect, useState } from "react";

export const useIsInView = (ref: { current: HTMLDivElement | null; }) => {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting); // entry.isIntersecting 表示是否在视口中
            },
            { threshold: 1 } // 触发的阈值（可调整）
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref]);

    return isInView;
};