import React from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label: React.FC<LabelProps> = ({ children, ...props }) => (
  <label {...props}>{children}</label>
);

export default Label;
