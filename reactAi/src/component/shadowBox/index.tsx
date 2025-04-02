import './index.scss'

const ShadowBox = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="shadowBox">
            {children}
        </div>
    );
};

export default ShadowBox