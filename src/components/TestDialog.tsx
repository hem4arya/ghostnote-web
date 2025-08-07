import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";

const TestDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Dialog</button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
          <p>This is a test dialog.</p>
          <button onClick={() => setOpen(false)}>Close</button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestDialog;
