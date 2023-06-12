import React, { useEffect, useState } from "react";
import { PrimaryButton, TextEditor, TextField } from "../components";
import { API_URL } from "../config/api";
import axios from "axios";
import { Redirect, useParams } from "react-router-dom/cjs/react-router-dom.min";
import useQuery from "../hooks/useQuery";
import ReportCreationSuccess from "./ReportCreationSuccess";

const ReportCreation = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({})
  const [reportCreated, setReportCreated] = useState(false)
  const searchParams = useQuery();
  const [campaignExist, setCampaignExist] = useState(true)
  const { slug } = useParams()

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  const handleSendData = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/campaigns/${slug}/reports`, { title, body }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh": refreshToken,
        },
      });
      if(response.status === 201) {
        setReportCreated(true)
      }
    } catch (error) {
      if (error.response.status === 400) {
        setErrors(error.response.data.errors);
      }
      if (error.response.status === 403) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          setErrors({ user: 'Your token is not valid' })
        }
      }
    }
    setLoading(false)
  };

  const checkSlug = async () => {
    try {
      const response = await axios.get(`${API_URL}/campaigns/check-slug/${slug}`)
      const { exist } = response.data.data

      setCampaignExist(exist)
    } catch(err) {
      if(err.response.status === 409) {
        setCampaignExist(true)
      } else {
        setCampaignExist(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSendData()
  };

  useEffect(() => {
    checkSlug()
  }, [])


  if(!campaignExist) {
    return <div>Campaign with slug: {slug} is not found</div>
  }

  if (reportCreated) {
    return <ReportCreationSuccess />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-[430px] mx-auto relative border min-h-screen p-4 bg-tertiary space-y-4">
        <TextField
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Judul"
          error={errors.title}
        />
        <div className="space-y-2">
          <label className="font-semibold">Body</label>
          <TextEditor value={body} onChange={setBody} />
          {errors.body && (
            <span className="text-red-500 text-sm">{errors.body}</span>
          )}
        </div>
        { errors.user && (
          <div>
            <p className="text-red-500">{ errors.user }</p>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <PrimaryButton loading={loading} label="Buat" />
        </div>
      </div>
    </form>
  );
};

export default ReportCreation;
