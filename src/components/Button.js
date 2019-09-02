import React from "react";
import className from "classnames";

import "components/Button.scss";
import { action } from "@storybook/addon-actions/dist/preview";

export default function Button(props) {
   let buttonClass = className("button", {
      "button--confirm": props.confirm,
      "button--danger": props.danger
   });

   return <button
      className={buttonClass}
      onClick={props.onClick}
      disabled={props.disabled}
   >
      {props.children}
   </button>;
}
