import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./dance-simulation.sass";

interface IProps extends IBaseProps {
  dance: string;
  displayText: string;
  displayPlaceholder: string;
}
interface IState {
  isPlaying: boolean;
}

export class DanceSimulation extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { isPlaying: false };
  }
  public componentDidUpdate() {
    const { dance } = this.props;
    if (!this.state.isPlaying && dance && dance.length > 0) {
      const videoProtein: HTMLVideoElement = document.getElementById("videoProtein") as HTMLVideoElement;
      const videoCarb: HTMLVideoElement = document.getElementById("videoCarb") as HTMLVideoElement
        || document.getElementsByTagName("video")[1];
      if (dance === "carb") {
        videoCarb.play();
      } else if (dance === "protein") {
        videoProtein.play();
      }
      this.setState({ isPlaying: true });
    } else if (this.state.isPlaying && (!this.props.dance || this.props.dance.length === 0)){
      this.setState({ isPlaying: false });
    }
  }
  public render() {
    const { dance, displayText, displayPlaceholder } = this.props;
    const simulationPlaceholderClass = "simulation-placeholder " +
      (displayPlaceholder ? displayPlaceholder : "");
    const videoProteinStyle = dance === "protein" || displayPlaceholder === "tired" ? {} : { zIndex: -1 };
    const videoCarbStyle = dance === "carb" || displayPlaceholder === "hungry" ? {} : { zIndex: -1 };

    return (
      <div className="simulation-container">
        <div className={simulationPlaceholderClass}>
          <video id="videoProtein" poster="./assets/dance_placeholder.png"
            loop={false} playsInline={true} preload="auto"
            style={videoProteinStyle}
          >
            <source src="./assets/anika-tired.mp4" type="video/mp4" />
          </video>
          <video id="videoCarb" poster="./assets/dance_placeholder.png"
            loop={false} playsInline={true} preload="auto"
            style={videoCarbStyle}
          >
            <source src="./assets/anika-hungry.mp4" type="video/mp4" />
          </video>
          {displayText.length > 0 && <div className="simulation-text">{displayText}</div>}
        </div>
      </div>
    );
  }
}
