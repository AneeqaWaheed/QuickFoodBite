import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import SimpleLayout from "../../Components/Layout/SimpleLayout";
import ModeratorNavbar from "../../Components/Layout/ModeratorNavbar";
import pickUp from "../../assets/pickUp.png";
import ModeratorMenu from "../../Components/Layout/ModeratorMenu";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
const DEFAULT_SLOTS = [
  {
    startTime: "09:00",
    endTime: "11:00",
    isAvailable: false,
  },
  
];

const ModeratorAvailability = () => {
  const [auth, setAuth] = useAuth();
 const navigate = useNavigate();
  const location = useLocation();
  const [date, setDate] = useState(() => {
    const today = new Date();

    return today.toISOString().split("T")[0];
  });

  const [slots, setSlots] = useState(DEFAULT_SLOTS);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleLogout = () => {
    toast.success("Logout Successfully");

    setAuth({
      ...auth,
      user: null,
      token: "",
    });

    localStorage.removeItem("auth");

    navigate("/login");

    console.log("LOCATION STATE:", location.state);
  };
  // ----------------------------------
  // GET AVAILABILITY
  // ----------------------------------

  useEffect(() => {
    if (!date) return;

    getAvailability();
  }, [date]);

  const getAvailability = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/availability/${date}`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      if (
        data?.availability?.slots &&
        data.availability.slots.length > 0
      ) {
        setSlots(data.availability.slots);
      } else {
        setSlots(DEFAULT_SLOTS);
      }
    } catch (error) {
      console.error("GET AVAILABILITY ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load availability"
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // TOGGLE SLOT
  // ----------------------------------

  const toggleSlot = (index) => {
    setSlots((previousSlots) =>
      previousSlots.map((slot, i) =>
        i === index
          ? {
              ...slot,
              isAvailable: !slot.isAvailable,
            }
          : slot
      )
    );
  };

  // ----------------------------------
  // ADD SLOT
  // ----------------------------------

  const addSlot = () => {
    setSlots((previousSlots) => [
      ...previousSlots,
      {
        startTime: "19:00",
        endTime: "21:00",
        isAvailable: false,
      },
    ]);
  };

  // ----------------------------------
  // UPDATE TIME
  // ----------------------------------

  const updateSlot = (index, field, value) => {
    setSlots((previousSlots) =>
      previousSlots.map((slot, i) =>
        i === index
          ? {
              ...slot,
              [field]: value,
            }
          : slot
      )
    );
  };

  // ----------------------------------
  // DELETE SLOT
  // ----------------------------------

  const deleteSlot = (index) => {
    setSlots((previousSlots) =>
      previousSlots.filter((_, i) => i !== index)
    );
  };

  // ----------------------------------
  // SAVE
  // ----------------------------------

  const saveAvailability = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/availability`,
        {
          date,
          slots,
        },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      if (data.success) {
        setSuccess("Availability saved successfully");
      }
    } catch (error) {
      console.error("SAVE AVAILABILITY ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to save availability"
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------
  // FORMAT TIME
  // ----------------------------------

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <SimpleLayout title="Moderator - Profile">
    
          <ModeratorNavbar handleLogout={handleLogout} />
    
          {/* MAIN SECTION */}
          <div
            className="container-fluid"
            style={{
              backgroundImage: `url(${pickUp})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
              height: "100vh",
              width: "100%",
              margin: 0,
              padding: 0,
            }}
          >
            <div
              className="row"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                height: "100vh",
                width: "100%",
                margin: "0px",
                padding: "20px",
                overflowY: "auto",
              }}
            >
    
              {/* SIDEBAR */}
              <div className="col-md-3 mb-4 mb-md-0">
                <div className="bg-black p-3 rounded shadow">
                  <ModeratorMenu />
                </div>
              </div>
    
<div className="col-lg-9 col-md-8 rounded">

      <div className="card shadow-sm border-0 p-4">

        <h4 className="mb-2">
          Set Availability
        </h4>

        <p className="text-muted small">
          Choose your available time slots
        </p>

        <p className="text-muted small">
          You can add multiple time slots for today's
          or future dates.
        </p>


        {/* DATE */}

        <div className="mb-4">

          <label className="form-label fw-semibold">
            Select Date
          </label>

          <input
            type="date"
            className="form-control"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
          />

        </div>


        {loading ? (
          <div className="text-center py-4">
            Loading availability...
          </div>
        ) : (
          <>
            {/* SLOTS */}

            <div>

              {slots.map((slot, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-between border rounded p-3 mb-2"
                >

                  <div className="flex-grow-1">

                    {slot.startTime && slot.endTime ? (
                      <strong>
                        {formatTime(slot.startTime)}
                        {" - "}
                        {formatTime(slot.endTime)}
                      </strong>
                    ) : (
                      <span>
                        Select time
                      </span>
                    )}

                  </div>


                  {/* CUSTOM TIME */}

                  <div className="d-flex gap-2 me-3">

                    <input
                      type="time"
                      className="form-control form-control-sm"
                      value={slot.startTime}
                      onChange={(e) =>
                        updateSlot(
                          index,
                          "startTime",
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="time"
                      className="form-control form-control-sm"
                      value={slot.endTime}
                      onChange={(e) =>
                        updateSlot(
                          index,
                          "endTime",
                          e.target.value
                        )
                      }
                    />

                  </div>


                  {/* TOGGLE */}

                  <div
                    className={`form-check form-switch`}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={slot.isAvailable}
                      onChange={() =>
                        toggleSlot(index)
                      }
                    />
                  </div>


                  {/* DELETE */}

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteSlot(index)}
                  >
                    ×
                  </button>

                </div>
              ))}

            </div>


            {/* ADD SLOT */}

            <button
              type="button"
              className="btn btn-light w-100 mb-3"
              onClick={addSlot}
            >
              + Add Another Slot
            </button>


            {/* ERROR */}

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}


            {/* SUCCESS */}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}


            {/* SAVE */}

            <button
              type="button"
              className="btn btn-success w-100"
              onClick={saveAvailability}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Availability"}
            </button>

          </>
        )}

      </div>
      </div>
      </div>
      </div>
 </SimpleLayout>
  );
};

export default ModeratorAvailability;