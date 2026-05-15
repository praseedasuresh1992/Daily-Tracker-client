import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../utils/api";

export default function JoinWorkspace() {

  const { inviteCode } = useParams();

  const navigate = useNavigate();

  useEffect(() => {

    joinWorkspace();

  }, []);

  const joinWorkspace = async () => {

    try {

      const token = localStorage.getItem("token");

      await API.post(
        `/workspace/join/${inviteCode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <div>
      Joining Workspace...
    </div>
  );
}