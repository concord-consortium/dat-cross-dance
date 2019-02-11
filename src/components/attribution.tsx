import * as React from "react";
import { BaseComponent } from "./base";
import "./attribution.css";

interface IAttributionState {
  attributionVisible: boolean;
}
interface IProps { }

export class Attribution extends BaseComponent<IProps, IAttributionState> {
  public state: IAttributionState = {
    attributionVisible: false
  };

  public render() {
    const { attributionVisible } = this.state;
    const attributionDisplayClass = attributionVisible ? "attribution-container" : "attribution-container-hidden";
    return (<div className="attribution">
      <div className="attribution-logo" onClick={this.toggleAttribution} />
      <div className={attributionDisplayClass} onClick={this.toggleAttribution}>
        <div className="attribution-text">
          <div className="small-logo" onClick={this.toggleAttribution} />
          <div>
            The contents of this simulation were developed under a grant from the Department of Education.
            However, those contents do not necessarily represent the policy of the Department of
            Education, and you should not assume endorsement by the Federal government.
            This simulation was developed by Concord Consortium in cooperation
            with Indiana University and Educational Testing Service.
          </div>
          <div>Copyright © 2019 The Concord Consortium. All rights reserved.
            The software is licensed under the MIT license.
            Please see <a href="https://github.com/concord-consortium/dat-cross-farm/blob/master/LICENSE"
              target="_blank" rel="noopener">license</a> for
            other software and associated licensing included in this product.</div>
        </div>
      </div>
    </div>
    );
  }
  private toggleAttribution = () => {
    const visible = this.state.attributionVisible;
    this.setState({ attributionVisible: !visible });
  }
}

export default Attribution;
