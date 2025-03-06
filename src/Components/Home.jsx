import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const [banners, setBanners] = useState([]);
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [token, setToken] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const imageUrl = "https://api.fruteacorp.uz/images/";

  const getBanners = () => {
    axios.get('https://api.fruteacorp.uz/banner')
      .then((result) => {
        setBanners(result.data.data);
        console.log(result);
      })
      .catch((error) => {
        console.error("Bannerlarni yuklashda xatolik:", error);
      });
  };

  const saveBanner = async (e) => {
    e.preventDefault();

    const data = {
      link: link,
      title: title,
      image: image,
    };

    try {
      const response = await axios({
        url: selectedBanner ? `https://api.fruteacorp.uz/banner/${selectedBanner.id}` : 'https://api.fruteacorp.uz/banner',
        method: selectedBanner ? 'PATCH' : 'POST',
        data,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      toast.success(selectedBanner ? 'Banner Yangilandi' : 'Banner Qo\'shildi');
      getBanners();
      handleCloseModal();
    } catch (error) {
      toast.error('Banner Saqlanmadi');
      console.error("Banner saqlashda xatolik:", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBanner(null);
    setLink('');
    setTitle('');
    setImage(null);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    setTitle(banner.title);
    setLink(banner.link);
    setModalOpen(true);
  };

  const handleDeleteBanner = async (id) => {
    try {
      await axios.delete(`https://api.fruteacorp.uz/banner/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Banner o\'chirildi');
      getBanners();
    } catch (error) {
      toast.error('Banner o\'chirishda xatolik');
      console.error("Banner o'chirishda xatolik:", error);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  return (
    <div>
      {modalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={saveBanner}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                    <input
                      type="text"
                      id="title"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="link" className="block text-gray-700 text-sm font-bold mb-2">Link:</label>
                    <input
                      type="text"
                      id="link"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
                    <input
                      type="file"
                      id="image"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Saqlash
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCloseModal}
                  >
                    Bekor Qilish
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 ml-4"
        onClick={() => setModalOpen(true)}
      >
        Banner Qo'shish
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 px-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative overflow-hidden rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img src={`${imageUrl}${banner.image}`} alt={banner.title} className="w-full h-60 object-cover" />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white font-semibold text-lg text-center drop-shadow-md">{banner.title}</p>
              <a className="text-white font-semibold text-lg text-center drop-shadow-md" href={banner.link}>Batafsil</a>
              <div className="flex justify-end mt-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                  onClick={() => handleEditBanner(banner)}
                >
                  Tahrirlash
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleDeleteBanner(banner.id)}
                >
                  O'chirish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;