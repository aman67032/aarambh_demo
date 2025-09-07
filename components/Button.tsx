import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

interface ButtonProps {
  text: string;
  href: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, href, className }) => {
  return (
    <StyledWrapper className={className} data-no-splash="true">
      <Link href={href} passHref>
        <button className="button" data-no-splash="true">
          <div className="blob1" />
          <div className="blob2" />
          <div className="inner">{text}</div>
        </button>
      </Link>
    </StyledWrapper>
  );
};
// ...existing code...
const StyledWrapper = styled.div`
  .button {
    cursor: pointer;
    font-size: 1.4rem; /* reduced from 1.4rem */
    border-radius: 14px; /* slightly reduced */
    border: none;
    padding: 2px; /* reduced */
    background: radial-gradient(circle 60px at 80% -10%, #3fe9ff, #181b1b); /* reduced gradient size */
    position: relative;
    min-width: unset;
    min-height: unset;
  }

  .button::after {
    content: "";
    position: absolute;
    width: 50%;
    height: 45%;
    border-radius: 80px;
    top: 0;
    right: 0;
    box-shadow: 0 0 14px #00e1ff55;
    z-index: -1;
  }

  .blob1 {
    position: absolute;
    width: 55px; /* reduced from 70px */
    height: 100%;
    border-radius: 14px;
    bottom: 0;
    left: 0;
    background: radial-gradient(
      circle 35px at 0% 100%, /* reduced from 60px */
      #3fe9ff,
      #0000ff80,
      transparent
    );
    box-shadow: -7px 7px 18px #0051ff2d;
  }

  .inner {
    padding: 7px 14px; /* reduced from 14px 25px */
    border-radius: 12px;
    color: #fff;
    z-index: 3;
    position: relative;
    background: radial-gradient(circle 40px at 80% -50%, #777777, #0f1111); /* reduced gradient size */
    font-size: 0.95rem; /* reduced from 1.2rem */
  }

  .inner::before {
    content: "";
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 12px;
    background: radial-gradient(
      circle 35px at 0% 100%, /* reduced from 60px */
      #00e1ff1a,
      #0000ff11,
      transparent
    );
    position: absolute;
  }
`;
// ...existing code...

export default Button;