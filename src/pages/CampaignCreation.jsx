import { useEffect, useState } from "react";
import { PrimaryButton, TextEditor, TextField } from "../components";
import addSquare from "../assets/add-square-svgrepo-com.svg";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { API_URL } from "../config/api";
import useQuery from "../hooks/useQuery";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const CampaignCreation = () => {
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(null);
  const [slug, setSlug] = useState(null);
  const [location, setLocation] = useState(null);
  const [duration, setDuration] = useState(null);
  const [openCustom, setOpenCustom] = useState(false);
  const [image, setImage] = useState(null);
  const [permitDoc, setPermitDoc] = useState(null);
  const [description, setDescription] = useState("");
  const [soils, setSoils] = useState([]);
  const [soilId, setSoilId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [campaignCreated, setCampaignCreated] = useState(false);
  const [autoSelect, setAutoSelect] = useState(false)

  const searchParams = useQuery();

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const soil = searchParams.get("soil") || "";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handlePermitDocChange = (e) => {
    const file = e.target.files[0];
    setPermitDoc(file);
  };

  // Fungsi untuk mengkonversi base64 menjadi objek Blob
  const base64ToBlob = (base64String) => {
    const parts = base64String.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const byteCharacters = atob(parts[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    // Membuat objek Blob dengan mimetype yang diperoleh
    return new Blob(byteArrays, { type: contentType });
  };

  const makeFormData = () => {
    const formData = new FormData();
    title && formData.append("title", title);
    target && formData.append("target", target);
    duration && formData.append("duration", duration);
    description && formData.append("description", description);
    slug && formData.append("slug", slug);
    location && formData.append("location", location);
    soilId && formData.append("soilId", soilId);
    image && formData.append("image", base64ToBlob(image), "banner.jpg");
    permitDoc && formData.append("permitDocument", permitDoc);

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = makeFormData();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/campaigns`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
          "x-refresh": refreshToken,
        },
      });
      if (response.status === 201) {
        setCampaignCreated(true);
      }
    } catch (error) {
      if (error.response.status === 400) {
        setErrors(error.response.data.errors);
      }
    }
    setLoading(false);
  };

  const getSoilOptions = async () => {
    try {
      const response = await axios(`${API_URL}/soils`);
      if (response.data) {
        setSoils(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSoilOptions();
  }, []);

  if (campaignCreated) {
    return <Redirect to="/campaigns/create/success" />;
  }

  if (!autoSelect && soil && soils.length > 0) {
    const selectedSoils = soils.find(item => item.type.toLowerCase() === soil.toLowerCase())
    if (selectedSoils) {
      setSoilId(parseInt(selectedSoils.id))
      setAutoSelect(true)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-[430px] mx-auto border min-h-screen p-4 bg-tertiary space-y-4">
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Judul"
          error={errors.title}
          name="title"
        />
        <div className="flex flex-col">
          <div className="relative">
            <input
              id="floating_outlined"
              className="block px-2.5 pl-10 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-primary peer"
              placeholder=" "
              type="number"
              name="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
            <label
              htmlFor="floating_outlined"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-tertiary dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Target
            </label>
            <span className="absolute left-4 top-[50%] translate-y-[-50%]">
              Rp
            </span>
          </div>
          {errors.target && (
            <span className="text-red-500 text-sm">{errors.target}</span>
          )}
        </div>
        <div>
          <select
            id="countries"
            onChange={(e) => setSoilId(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
          >
            <option selected value="">Pilih jenis tanah</option>
            {soils.map((soilItem) => (
              <option
                value={soilItem.id}
                selected={soil.toLowerCase() === soilItem.type.toLowerCase()}
                key={soilItem.id}
              >
                {soilItem.type}
              </option>
            ))}
          </select>

          {errors.soilId && (
            <span className="text-red-500 text-sm">{errors.soilId}</span>
          )}
        </div>
        <TextField
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          label="Slug"
          error={errors.slug}
          name="slug"
        />
        <TextField
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          label="Lokasi"
          error={errors.location}
          name="location"
        />
        <div className="w-full space-y-2">
          <label className="font-semibold">Durasi kampanye</label>
          <div className="w-full flex flex-wrap">
            <div className="w-1/2 pr-2 mb-1">
              <div
                type="button"
                onClick={() => {
                  setOpenCustom(false);
                  setDuration(30);
                }}
                className={`w-full cursor-pointer py-3 focus:ring-4 focus:ring-tertiary font-medium rounded-lg text-sm px-5 mr-2 h-14 flex items-center mb-2 ${
                  duration === 30
                    ? "text-white bg-secondary"
                    : "text-gray-900 bg-white"
                }`}
              >
                30 hari
              </div>
            </div>
            <div className="w-1/2 pl-2 mb-1">
              <div
                type="button"
                onClick={() => {
                  setOpenCustom(false);
                  setDuration(60);
                }}
                className={`w-full cursor-pointer py-3 focus:ring-4 focus:ring-tertiary font-medium rounded-lg text-sm px-5 mr-2 h-14 flex items-center mb-2 ${
                  duration === 60
                    ? "text-white bg-secondary"
                    : "text-gray-900 bg-white"
                }`}
              >
                60 hari
              </div>
            </div>
            <div className="w-1/2 pr-2 mb-1">
              <div
                type="button"
                onClick={() => {
                  setOpenCustom(false);
                  setDuration(120);
                }}
                className={`w-full cursor-pointer py-3 focus:ring-4 focus:ring-tertiary font-medium rounded-lg text-sm px-5 mr-2 h-14 flex items-center mb-2 ${
                  duration === 120
                    ? "text-white bg-secondary"
                    : "text-gray-900 bg-white"
                }`}
              >
                120 hari
              </div>
            </div>
            <div className="w-1/2 pl-2 mb-1">
              <div
                type="button"
                onClick={() => {
                  setDuration(null);
                  setOpenCustom(true);
                }}
                className={`w-full cursor-pointer py-3 focus:ring-4 focus:ring-tertiary font-medium rounded-lg text-sm px-5 mr-2 h-14 flex items-center mb-2 ${
                  openCustom
                    ? "text-white bg-secondary"
                    : "text-gray-900 bg-white"
                }`}
              >
                {openCustom ? (
                  <div className="flex justify-start items-center">
                    <input
                      autoFocus
                      onChange={(e) => setDuration(e.target.value)}
                      value={duration}
                      type="number"
                      style={{ border: 0, outline: 0 }}
                      className="w-12 bg-transparent outline-none focus:ring-0 border-none focus:outline-none focus:border-none text-white h-14"
                    />
                    <span>hari</span>
                  </div>
                ) : (
                  "custom"
                )}
              </div>
            </div>
          </div>
          {errors.duration && (
            <span className="text-red-500 text-sm">Duration is required</span>
          )}
        </div>
        <div>
          <label className="font-semibold">Banner galangdana</label>
          <input
            type="file"
            id="bannerInput"
            className="hidden"
            onChange={handleImageChange}
            accept="image/*"
          />
          <label htmlFor="bannerInput">
            <div className="w-1/2 h-24 mt-2 rounded-lg bg-transparent overflow-hidden border-2 border-primary flex justify-center items-center">
              {image ? (
                <div className="object-center object-cover">
                  <img src={image} className="w-full" alt="" />
                </div>
              ) : (
                <img src={addSquare} className="h-6" alt="" />
              )}
            </div>
          </label>
          {errors.image && (
            <span className="text-red-500 text-sm">{errors.image}</span>
          )}
        </div>
        <div>
          <label
            className="block mb-2 font-semibold text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Surat izin kegiatan
          </label>
          <input
            className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            accept="application/pdf"
            onChange={handlePermitDocChange}
          />
          {errors.permitDocument && (
            <span className="text-red-500 text-sm">
              {errors.permitDocument}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Deskripsi kampanye</label>
          <TextEditor value={description} onChange={setDescription} />
          {errors.description && (
            <span className="text-red-500 text-sm">{errors.description}</span>
          )}
        </div>
        <div className="pt-4 pb-2">
          <PrimaryButton loading={loading} label="Buat" />
        </div>
      </div>
    </form>
  );
};

export default CampaignCreation;
