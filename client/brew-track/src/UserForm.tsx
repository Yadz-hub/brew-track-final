import React, { FormEvent } from "react";

interface UserFormProps {
  onChange: (userData: UserDetails) => void;
}

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
}

function UserForm(props: UserFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userData: UserDetails = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
    };
    props.onChange(userData);
  };

  return (

    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <h2>Please fill in details to see breweries!</h2>
      <label style={{ marginBottom: "10px" }}>
        First name:
        <input type="text" name="firstName" required style={{ marginLeft: "10px" }} />
      </label>
      <label style={{ marginBottom: "10px" }}>
        Last name:
        <input type="text" name="lastName" required style={{ marginLeft: "10px" }} />
      </label>
      <label style={{ marginBottom: "10px" }}>
        Email:
        <input type="email" name="email" required style={{ marginLeft: "10px" }} />
      </label>
      <button type="submit" style={{ marginTop: "20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", padding: "10px 20px", cursor: "pointer" }}>Submit</button>
    </form>
  );
}

export default UserForm;
