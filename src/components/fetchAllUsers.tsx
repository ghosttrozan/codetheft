import { useEffect, useState } from "react";
import { AvatarCircles } from "./ui/avatar-circles";

export default function AllUsers() {
  const [users, setUsers] = useState([]);

  async function fetchAllUser() {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  useEffect(() => {
    async function getUsers() {
      const data = await fetchAllUser();
      setUsers(data);
    }
    getUsers();
  }, []);

  console.log(users);

  if (!users || users.length === 0) return null;

  const avatarUrls = users.map(
    (user: any) =>
      user.image ||
      "https://imgs.search.brave.com/iqNtMFzPA0AyX1v_QsZwP7kzbrY1HPH4uaWwJl0h1rI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA1LzYwLzI2LzA4/LzM2MF9GXzU2MDI2/MDg4MF9PMVYzUW0y/Y05PNUhXak42Nm1C/aDJOcmxQSE5IT1V4/Vy5qcGc"
  );

  return (
    <div>
      <AvatarCircles numPeople={users.length} avatarUrls={avatarUrls} />
    </div>
  );
}
