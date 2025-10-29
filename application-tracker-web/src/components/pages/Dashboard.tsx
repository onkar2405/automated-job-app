import { Container, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import ApplicationsTable from "../ApplicationsTable";
import AddApplicationModal from "../AddApplicationModal";
import { Application } from "../../types/application";
import "../../styles/theme.css";
import { useDispatch, useSelector } from "react-redux";
import { setInitialApplications } from "../../store/ApplicationSlice";
import { getFormattedApplications } from "../../utils/typeFormatters";

/**
 * Function component to display to Job dashboard.
 */
export default function Dashboard() {
  const applications = useSelector(
    (state: any) => state.applicationReducer.applications
  );
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);

  const fetchApplications = () => {
    return fetch("http://localhost:5000/applications")
      .then((data) => data.json())
      .then((data) =>
        dispatch(setInitialApplications(getFormattedApplications(data)))
      )
      .catch((e) => {
        return [];
      });
  };

  const removeApplication = (id: number) => {
    fetch("http://localhost:5000/removeApplication", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        id,
      }),
    }).then((res) => {
      if (res.ok) {
        fetchApplications();
      }
    });
  };

  const addApplication = async (data: Application) => {
    const { id, company, date, role } = data;

    const payLoadData = {
      id,
      company,
      appliedOn: date,
      role,
      status: "APPLIED",
    };

    await fetch("http://localhost:5000/addApplication", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(payLoadData),
    }).catch((e) => {
      throw e;
    });

    setTimeout(() => {
      fetchApplications();
    }, 2000);
  };

  const handleSave = (data: Application) => {
    addApplication(data);
    setModalOpen(false);
  };

  useEffect(function () {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Job Applications
      </Typography>

      <Button
        className="google-button google-button-primary"
        sx={{ mb: 2 }}
        onClick={() => setModalOpen(true)}
      >
        Add Application
      </Button>

      <ApplicationsTable
        applications={applications}
        removeApplication={removeApplication}
      />

      <AddApplicationModal
        applications={applications}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </Container>
  );
}
