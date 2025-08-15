import { Container, Typography, Button } from "@mui/material";
import { useState } from "react";
import ApplicationsTable from "../ApplicationsTable";
import AddApplicationModal from "../AddApplicationModal";
import { Application } from "../../types/application";
import { useDispatch, useSelector } from "react-redux";
import { addApplication } from "../../store/ApplicationSlice";

export default function Dashboard() {
  const applications = useSelector(
    (state: any) => state.applicationReducer.applications
  );
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (data: Application) => {
    dispatch(addApplication(data));
    setModalOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Job Applications
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => setModalOpen(true)}
      >
        Add Application
      </Button>

      <ApplicationsTable applications={applications} />

      <AddApplicationModal
        applications={applications}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </Container>
  );
}
