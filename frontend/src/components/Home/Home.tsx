import Header from "./Header/Header";
import Board from "./Trello/Board";

const Home = () => {
  return (
    <div>
      <Header />
      <div className="bg-gradient-to-t from-bgTrelloWeb  to-bgTrelloWeb1 min-h-screen">
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div>
            {/* Trello */}
            <div className="mt-[60px]">
              <Board />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
