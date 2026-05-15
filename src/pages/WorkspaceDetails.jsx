import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import API from "../utils/api";

export default function WorkspaceDetails() {

    const [workspace, setWorkspace] = useState(null);

    const { workspaceId } = useParams();

    useEffect(() => {

        getWorkspace();

    }, []);

    const getWorkspace = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await API.get(
                `/workspace/${workspaceId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setWorkspace(res.data);

        } catch (error) {
            console.log(error);
        }
    };

    if (!workspace) {
        return <div>Loading...</div>;
    }

    // CREATE INVITE LINK HERE
    const inviteLink =
        `http://localhost:5173/join/${workspace.inviteCode}`;

    return (
        <div>

            <h1>{workspace.name}</h1>

            <input
                value={inviteLink}
                readOnly
            />

            <button
                onClick={() => navigator.clipboard.writeText(inviteLink)}
            >
                Copy Invite Link
            </button>

        </div>
    );
}