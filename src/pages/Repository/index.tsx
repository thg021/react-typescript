import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import { Header, ImgLogo, RepositoryInfo, Issues } from './styles';

import Logo from '../../assets/Octocat.png';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issue {
  title: string;
  id: number;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const { params } = useRouteMatch<RepositoryParams>();

  useEffect(() => {
    api
      .get(`repos/${params.repository}`)
      .then((response) => setRepositories(response.data));

    api
      .get(`repos/${params.repository}/issues`)
      .then((response) => setIssues(response.data));
  }, [params.repository]);

  return (
    <>
      <Header>
        <ImgLogo src={Logo} alt="Github explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          voltar
        </Link>
      </Header>

      {repositories && (
        <RepositoryInfo>
          <header>
            <img
              src={repositories.owner.avatar_url}
              alt={repositories.owner.login}
            />
            <div>
              <strong>{repositories.full_name}</strong>
              <p>{repositories?.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repositories.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repositories.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repositories.open_issues_count}</strong>
              <span>Issues</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {issues.map((item) => (
          <Link key={item.id} to={item.html_url}>
            <div>
              <strong>{item.title}</strong>
              <p>{item.user.login}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
