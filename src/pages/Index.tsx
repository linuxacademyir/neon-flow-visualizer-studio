import { WorkflowBuilder } from "@/components/WorkflowBuilder";
import { ReactFlowProvider } from "@xyflow/react";

const Index = () => {
  return (
    <ReactFlowProvider>
      <WorkflowBuilder />
    </ReactFlowProvider>
  );
};

export default Index;
