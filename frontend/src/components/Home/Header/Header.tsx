import logo1 from "../../../assets/6124991.png";
import { useNavigate } from "react-router-dom";
import { useSearchStore } from "../../../main";

function Header() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email") || "Email Name";
  console.log("email", email);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    navigate("/login");
  };

  // search
  const { searchString, setSearchString } = useSearchStore((state) => ({
    searchString: state.searchString,
    setSearchString: state.setSearchString,
  }));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  return (
    <div className="flex justify-between items-center p-4 bg-slate-300">
      <div className="flex items-center ml-[100px]">
        <div className="mr-4">
          <img src={logo1} className="w-12" alt="Logo" />
        </div>
        <div className="flex items-center px-4 py-3 rounded-md border-2 border-gray-600 max-w-md font-sans w-[600px]">
          <input
            value={searchString}
            onChange={handleChange}
            type="text"
            placeholder="Search Something..."
            className="w-full outline-none bg-transparent text-black text-sm text-[16px]"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 mr-[200px]">
        <div className="text-[19px] font-bold text-gray-500 mr-8">{email}</div>
        <div
          className="inline-block px-4 py-2 text-gray-400 font-bold text-[18px] hover:bg-gray-800 bg-gray-800 border border-gray-600 rounded-md cursor-pointer  transition-colors duration-300 focus:outline-none focus:ring-2"
          role="button"
          tabIndex={0}
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
    </div>
  );
}

export default Header;
