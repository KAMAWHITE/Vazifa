import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

function Home() {
  const { register, setValue, watch, handleSubmit, reset } = useForm();
  const [banner, setBanner] = useState([]);
  const baseURL = 'https://api.fruteacorp.uz';
  const token = localStorage.getItem("token");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getBanner = () => {
    axios.get(`${baseURL}/banner`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setBanner(res?.data?.data))
      .catch(err => console.error("Error fetching banners:", err));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('image', [file]);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('link', data.link);

    const file = watch('image');

    if (file && file.length > 0) {
      formData.append('image', file[0]);
    } else if (selectedItem && selectedItem.image) {
      formData.append('image', selectedItem.image);
    }

    axios({
      url: selectedItem ? `${baseURL}/banner/${selectedItem.id}` : `${baseURL}/banner`,
      method: selectedItem ? 'PATCH' : 'POST',
      data: formData,
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      getBanner();
      reset();
      setSelectedItem(null);
      setIsModalOpen(false);
    }).catch(err => console.error("Error saving banner:", err));
  };


  const showBanner = (banner) => {
    setValue('title', banner.title);
    setValue('link', banner.link);
    setSelectedItem(banner);
    setIsModalOpen(true);
  };

  const DeleteBanner = (banner) => {
    axios.delete(`${baseURL}/banner/${banner.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => getBanner())
      .catch(err => console.error("Error deleting banner:", err));
  };

  useEffect(() => {
    getBanner();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Banner Manager</h1>

      <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
        Add Banner
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-60 flex justify-center items-center">
          <div className="bg-white shadow-md p-6 rounded-lg w-96 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl">
              &times;
            </button>
            <h2 className="text-xl font-bold text-center mb-4">{selectedItem ? "Edit Banner" : "Add Banner"}</h2>
            <div className="grid gap-4">
              <input type="text" {...register('title')} placeholder="Title" className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" {...register('link')} placeholder="Link" className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="file" onChange={handleFile} className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={handleSubmit(onSubmit)} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                {selectedItem ? "Update Banner" : "Add Banner"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-8">
        {banner.length > 0 ? (
          banner.map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-110">
              <img
                src={item.image ? `${baseURL}/images/${item.image}` : 'default-image.jpg'}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600 truncate">{item.link}</p>
                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => showBanner(item)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">
                    Edit
                  </button>
                  <button
                    onClick={() => DeleteBanner(item)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full">No banners found</p>
        )}
      </div>
    </div>
  );
}

export default Home;