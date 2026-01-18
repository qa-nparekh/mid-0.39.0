import './index.less';
import sqaiLogo from '../../assets/sqai-logo.png';

export const LogoUrl = sqaiLogo;

export const Logo = ({ hideLogo = false }: { hideLogo?: boolean }) => {
  if (hideLogo) {
    return null;
  }

  return (
    <div className="logo">
      <a href="https://sqai.tech" target="_blank" rel="noreferrer">
        <img
          alt="SQAI Logo"
          src={sqaiLogo}
        />
      </a>
    </div>
  );
};
