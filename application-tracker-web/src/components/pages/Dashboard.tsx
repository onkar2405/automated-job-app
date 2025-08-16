import { Container, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import ApplicationsTable from "../ApplicationsTable";
import AddApplicationModal from "../AddApplicationModal";
import { Application } from "../../types/application";
import { useDispatch, useSelector } from "react-redux";
import {
  addApplication,
  setInitialApplications,
} from "../../store/ApplicationSlice";
import { getFormattedApplications } from "../../utils/typeFormatters";

export default function Dashboard() {
  const applications = useSelector(
    (state: any) => state.applicationReducer.applications
  );
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);

  const fetchApplications = () => {
    return fetch("http://localhost:5000/applications")
      .then((data) => data.json())
      .then((data) => {
        const apps = getFormattedApplications(data);
        dispatch(setInitialApplications(apps));
        return;
      });
  };

  const handleSave = (data: Application) => {
    dispatch(addApplication(data));
    setModalOpen(false);
  };

  useEffect(function () {
    fetchApplications();
  });

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
