import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const CreateProfile = props => {
  const [formData, setFormData] = useState({
    company: "",
    website: "",
    location: "",
    bio: "",
    status: "",
    githubusername: "",
    skills: "",
    youtube: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: ""
  });
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = formData;
  return <div></div>;
};

CreateProfile.propTypes = {};

export default CreateProfile;
