import { Route, Routes } from 'react-router-dom';
import './App.scss';
import Article from './components/newArticle/Article';
import Articles from './components/articlesAll/Articles';
import MoreInfo from './components/moreInfo/MoreInfo';
import SignIn from './components/signIn/SignIn';
import SignUp from './components/signUp/SignUp';
import Header from './components/header/Header';
import EditProfile from './components/editProfile/EditProfile';
import EditArticle from './components/editArticle/EditArticle';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Articles />} />
        <Route path="/articles/:slug" element={<MoreInfo />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/profile" element={<EditProfile />} />
        <Route path="/Article" element={<Article />} />
        <Route path="/editArticle/:slug" element={<EditArticle />} />

      </Routes>
    </>
  );
}

export default App;
