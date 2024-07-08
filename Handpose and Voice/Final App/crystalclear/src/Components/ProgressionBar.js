// src/ProgressBar.js
import React from "react";
import { useState, useEffect } from "react";
import "./ProgressBar.css";
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Box,
} from "@chakra-ui/react";

const steps = [
  { title: "Welcome", description: " " },
  { title: "Doing Good", description: " " },
  { title: "Almost Done", description: " " },
];

function ProgressBar({ index }) {
  const [activeStep, setActiveStep] = useState(index);

  useEffect(() => {
    setActiveStep(index);
  }, [index]);

  return (
    <header className="ProgressBar">
      <Stepper
        className="Stepper"
        ml={10}
        mr={10}
        size="lg"
        colorScheme="green"
        index={activeStep}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box p={1} m={1} ml={10} mr={10} flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </header>
  );
}

export default ProgressBar;
