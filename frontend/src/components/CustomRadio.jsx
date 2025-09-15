import React from 'react'
import {RadioGroup, Radio, cn} from "@heroui/react";
function CustomRadio(props) {
const {children, ...otherProps} = props;
  return (
   <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "m-0 bg-content1 hover:bg-content2 flex-1",
          "cursor-pointer rounded-lg p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
          "w-[10rem]"
        ),
      }}
    >
      {children}
    </Radio>
  )
}

export default CustomRadio