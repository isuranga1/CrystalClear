import { useState, useEffect } from "react";

const useBlendShapeCheck = (blendshape0, blendshape1) => {
  const [result, setResult] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (blendshape0 > 1) {
      timeoutId = setTimeout(() => {
        if (blendshape1 > 1) {
          setResult(true);
        } else {
          setResult(false);
        }
      }, 1000);
    } else {
      setResult(false);
    }

    return () => clearTimeout(timeoutId);
  }, [blendshape0, blendshape1]);

  return result;
};

export default useBlendShapeCheck;
