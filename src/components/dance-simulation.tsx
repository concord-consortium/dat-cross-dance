import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./dance-simulation.sass";

interface IProps extends IBaseProps {
  dance: string;
  displayText: string;
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
      const video: HTMLVideoElement = document.getElementsByTagName("video")[0];
      const videoUrl = dance === "carb" ? "./assets/anika-hungry.mp4" :
        dance === "protein" ? "./assets/anika-tired.mp4" : "";
      video.src = videoUrl;
      video.play();

      this.setState({ isPlaying: true });
    } else if (this.state.isPlaying && (!this.props.dance || this.props.dance.length === 0)){
      this.setState({ isPlaying: false });
    }
  }
  public render() {
    const { dance, displayText } = this.props;
    const simulationPlaceholderClass = "simulation-placeholder " + (dance ? dance : "");
    const isPlaying = dance && dance.length > 0;
    const videoUrl = dance === "carb" ? "./assets/anika-hungry.mp4" :
      dance === "protein" ? "./assets/anika-tired.mp4" : "";
    return (
      <div className="simulation-container">
        <div className={simulationPlaceholderClass}>
          <video id="video1" poster="./assets/dance_placeholder.png"
            loop={false} playsInline={true}>
            <source src={videoUrl} type="video/mp4" />
          </video>
          {displayText.length > 0 && <div className="simulation-text">{displayText}</div>}
        </div>
      </div>
    );
  }
}
