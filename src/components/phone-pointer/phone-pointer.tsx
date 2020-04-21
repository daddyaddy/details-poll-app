import React from "react";
import "./phone-pointer.scss";
import { PhoneAnimationFrame } from "../phone/phone";

type PhonePointerProps = {
  isRunning: boolean;
  animationFrame: PhoneAnimationFrame;
  elementRef: React.RefObject<HTMLDivElement> | null;
  phoneInnerRef: React.RefObject<HTMLDivElement>;
  onAnimationFrameStart?: () => void;
  onAnimationFrameMoveStart?: () => void;
  onAnimationFrameMoveEnd?: () => void;
  onAnimationFrameStandingStart?: () => void;
  onAnimationFrameStandingEnd?: () => void;
  onAnimationFrameEnd?: () => void;
};
type PhonePointerState = {
  previousElement: null | React.RefObject<HTMLDivElement>;
  currentEvent: null | "click";
  x: number;
  y: number;
};

class PhonePointer extends React.Component<
  PhonePointerProps,
  PhonePointerState
> {
  static readonly width: number = 30;
  static readonly height: number = 30;
  static readonly defaultMoveDuration: number = 900;
  static readonly defaultStandDuration: number = 500;
  moveEndTimeout: NodeJS.Timeout | any;
  standEndTimeout: NodeJS.Timeout | any;
  eventEndTimeout: NodeJS.Timeout | any;

  state: PhonePointerState = {
    previousElement: null,
    currentEvent: null,
    x: 0,
    y: 0,
  };

  constructor(props: PhonePointerProps) {
    super(props);
  }

  componentDidMount() {
    this.animate();
  }

  componentDidUpdate(oldProps: PhonePointerProps) {
    const { isRunning, animationFrame } = this.props;
    if (
      oldProps.isRunning !== isRunning ||
      oldProps.animationFrame !== animationFrame
    ) {
      this.animate();
    }
  }

  animate() {
    const { isRunning, onAnimationFrameStart } = this.props;
    if (!isRunning) return;
    onAnimationFrameStart && onAnimationFrameStart();
    setTimeout(() => {
      this.move();
    }, 1);
  }

  getMiddle = (
    offsetLeft: number,
    offsetTop: number,
    offsetWidth: number,
    offsetHeight: number
  ): { x: number; y: number } => {
    return {
      x: offsetLeft + offsetWidth / 2 - PhonePointer.width / 2,
      y: offsetTop + offsetHeight / 2 - PhonePointer.height / 2,
    };
  };

  setPositionFromCords = (position: { x: number; y: number }): void => {
    this.setState({
      x: position.x,
      y: position.y,
    });
  };

  setPositionFromElement = (
    element: React.RefObject<HTMLDivElement> | null
  ): void => {
    const { phoneInnerRef } = this.props;
    if (element === null || element.current === null) return;
    if (phoneInnerRef.current === null) return;

    const { offsetWidth, offsetHeight } = element.current as HTMLDivElement;

    const phoneInnerRect: DOMRect = (phoneInnerRef.current as HTMLDivElement).getBoundingClientRect();

    const elementRect: DOMRect = element.current.getBoundingClientRect();

    const middle: { x: number; y: number } = this.getMiddle(
      elementRect.x - phoneInnerRect.x,
      elementRect.y - phoneInnerRect.y,
      offsetWidth,
      offsetHeight
    );

    this.setState({
      x: middle.x,
      y: middle.y,
    });
  };

  addHover = (element: React.RefObject<HTMLDivElement> | null): void => {
    if (element === null || element.current === null) return;
    element.current.classList.add("_hover");
  };

  removeHover = (element: React.RefObject<HTMLDivElement> | null): void => {
    if (element === null || element.current === null) return;
    element.current.classList.remove("_hover");
  };

  move() {
    const {
      animationFrame,
      elementRef,
      onAnimationFrameMoveStart,
      onAnimationFrameMoveEnd,
    } = this.props;
    const { position } = animationFrame;
    if (position.hasOwnProperty("x") && position.hasOwnProperty("y")) {
      this.setPositionFromCords(position as { x: number; y: number });
    } else if (position.hasOwnProperty("element")) {
      this.setPositionFromElement(elementRef);
      this.addHover(elementRef);
    }

    onAnimationFrameMoveStart && onAnimationFrameMoveStart();

    clearTimeout(this.moveEndTimeout);
    this.moveEndTimeout = setTimeout(
      () => {
        onAnimationFrameMoveEnd && onAnimationFrameMoveEnd();
        this.stand();
      },
      animationFrame.movingDuration
        ? animationFrame.movingDuration
        : PhonePointer.defaultMoveDuration
    );
  }

  clickToElement = (element: React.RefObject<HTMLDivElement> | null): void => {
    const { currentEvent } = this.state;
    if (element === null || element.current === null) return;
    element.current.click();
  };

  stand() {
    const {
      onAnimationFrameStandingStart,
      onAnimationFrameStandingEnd,
      animationFrame,
    } = this.props;

    onAnimationFrameStandingStart && onAnimationFrameStandingStart();

    clearTimeout(this.standEndTimeout);
    this.standEndTimeout = setTimeout(
      () => {
        onAnimationFrameStandingEnd && onAnimationFrameStandingEnd();
        this.callEvent();
      },
      animationFrame.standingDuration
        ? animationFrame.standingDuration
        : PhonePointer.defaultStandDuration
    );
  }

  callEvent() {
    const { onAnimationFrameEnd, animationFrame, elementRef } = this.props;
    const { position } = animationFrame;

    this.setState({
      currentEvent: animationFrame.eventName,
    });

    clearTimeout(this.eventEndTimeout);
    switch (this.state.currentEvent) {
      case "click":
        this.eventEndTimeout = setTimeout(() => {
          this.clickToElement(elementRef);
          onAnimationFrameEnd && onAnimationFrameEnd();
        }, 500);
        break;
      default:
        onAnimationFrameEnd && onAnimationFrameEnd();
        break;
    }
  }

  render() {
    const { animationFrame } = this.props;
    const { currentEvent, x, y } = this.state;
    return (
      <div
        className="phone-pointer-wrapper"
        style={{
          transitionDuration: `${
            animationFrame.movingDuration
              ? animationFrame.movingDuration
              : PhonePointer.defaultMoveDuration
          }ms`,
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        <div className={`pointer _${currentEvent}`}>
          <div className="pointer-circle"></div>
        </div>
      </div>
    );
  }
}

export default PhonePointer;
