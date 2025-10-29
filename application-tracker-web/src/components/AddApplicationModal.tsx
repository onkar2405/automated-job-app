import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { Application } from "../types/application";
import "../styles/theme.css";

/**
 * Component to hold the Job application data.
 * @param applications - set of currently applied jobs.
 * @param open - whether application modal is open
 * @param onClose - method to close the modal
 * @param onSave - method to add the application
 */
export default function AddApplicationModal({
  applications,
  open,
  onClose,
  onSave,
}: {
  applications: Application[];
  open: boolean;
  onClose: any;
  onSave: any;
}) {
  const [form, setForm] = useState({
    id: -1,
    company: "",
    role: "",
    status: "Applied",
    date: "",
  });

  const handleChange = (e: any) =>
    setForm({
      ...form,
      id: applications.length + 1,
      [e.target.name]: e.target.value,
    });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Job Application</DialogTitle>
      <DialogContent>
        <TextField
          label="Company"
          name="company"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />
        <TextField
          label="Role"
          name="role"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button
          onClick={onClose}
          className="google-button google-button-secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSave(form)}
          className="google-button google-button-primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
