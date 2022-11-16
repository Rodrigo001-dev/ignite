import { 
  Box, 
  Button, 
  Checkbox, 
  Flex, 
  Heading, 
  Icon, 
  Spinner, 
  Table, 
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr, 
  useBreakpointValue
} from "@chakra-ui/react";
import Link from "next/link";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { useQuery } from 'react-query';

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";

import { api } from "../../services/api";

export default function UserList() {
  // dentro do useQuery('') como primeiro parâmetro eu passo qual a chave que
  // vou utilizar para armazenar em cache, para caso depois eu precise limpar
  // esse cache, revalidar ele, resetar, excluir ou qualquer coisa assim eu vou
  // ter um nome(chave) para me referir a esses dados e como segundo parâmetro
  // eu passo um método(uma função) que vai me retornar os dados
  // const query = useQuery('users', async () => {
  //   const response = await fetch('http://localhost:3000/api/users');
  //   const data = await response.json();

  //   return data;
  // });

  // quando utilizamos uma estratégia de dados em cache como o react-query é sempre
  // interessante ter dois Loadings, um para o carregamento inicial dos dados
  // (isLoading) e outro para a renovação dos dados(isFetching)

  // dentro do useQuery eu posso obter algumas informações, a primeira dessas
  // informações é o próprio data, a segunda informação é o isLoading que vai
  // dizer se a requisição está em processo de carregamento ou não, o isFetching
  // vai sinalizar se está sendo realizado o refetch(renovação) dos dados ou não,
  // outra informação é o error, se aconteceu um erro ou não dentro da aplicação
  const { data, isLoading, isFetching, error } = useQuery('users', async () => {
    const { data } = await api.get('users');

    // formatando os dados antes de chegar no frontnend
    const users = data.users.map(user => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      }
    });

    return users;
  }, {
    // o staleTime diz que essa query durante 5 segundos(1000 * 5) vai ser fresh
    // fresh quer dizer que os dados são recentes, que não vai ser necessário
    // realizar uma chamada para a API, ou seja, eu estou dizendo que durante
    // 5 segundos não vai ser necessário realizar uma chamada para API para
    // atualizar os dados
    staleTime: 1000 * 5, // 5 seconds
  });

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Box>
      <Header />

      {/* mx=auto é para ficar centralizado */}
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários

              {
                /*
                  o isFetching fica como true quando está acontecento o primeiro
                  carregamento, por isso o !isLoading
                  eu só vou mostrar o Loading do isFetching quando eu não estiver
                  no primeiro carregamento(!isLoading) e estiver com o isFetching
                  , ou seja, eu vou mostrar esse loading somente na renovação dos
                  dados e não no primeiro carregamento
                */
              }
              { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" /> }
            </Heading>

            {
              /*
               eu passei o passHref porque por mais que esse Button seja uma tag
               a do HTML, eu não estou passando a tag a em si e sim um Button
              */
            }
            <Link href="/users/create" passHref>
              <Button 
                as="a" 
                size="sm" 
                fontSize="sm" 
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar novo usuário
              </Button>
            </Link>
          </Flex>

          {
          /* 
            se o isLoading estiver true, ou seja, se estiver carregando eu vou
            mostrar um Spinner no centro da tela
          */
          }
          { isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
            // se não, se ocorreu um erro eu vou mostar uma menssagem de erro
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos usuários.</Text>
            </Flex>
            // se não, ou seja, se não estiver com o isLoading true e não tiver
            // dado nenhum erro eu vou mostar a tabela de usuários
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    {/* px={small="4", medium="4", large="6"} */}
                    <Th px={["4", "4", "6"]} color="gray.300" width="8">
                      <Checkbox colorScheme="pink" />
                    </Th>

                    <Th>Usuário</Th>
                    { isWideVersion && <Th>Data de cadastro</Th> }
                    { isWideVersion && <Th width="8"></Th> }
                  </Tr>
                </Thead>

                <Tbody>
                  {data.map(user => {
                    return (
                      <Tr key={user.id}>
                        <Td px={["4", "4", "6"]}>
                          <Checkbox colorScheme="pink" />
                        </Td>

                        <Td>
                          <Box>
                            <Text fontWeight="bold">{user.name}</Text>
                            <Text fontSize="sm" color="gray.300">{user.email}</Text>
                          </Box>
                        </Td>

                        { isWideVersion && <Td>{user.createdAt}</Td> }

                        { isWideVersion && (
                          <Td>
                            <Button 
                              as="a" 
                              size="sm" 
                              fontSize="sm" 
                              colorScheme="purple"
                              leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                            >
                              Editar
                            </Button>
                          </Td>
                        ) }
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>

              <Pagination />
            </>
          ) }
        </Box>
      </Flex>
    </Box>
  );
};