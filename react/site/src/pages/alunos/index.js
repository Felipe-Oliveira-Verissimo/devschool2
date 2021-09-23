import Cabecalho from '../../components/cabecalho'
import Menu from '../../components/menu'
import LoadingBar from 'react-top-loading-bar'
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; 


import { Container, Conteudo } from './styled'


import Api from '../../service/api';
import { useState, useEffect, useRef } from 'react';
const api = new Api();

export default function Index() {

    const [ alunos, setAlunos ] = useState([]);
    const [nome, setNome] = useState('');
    const [chamada, setChamada] = useState('');
    const [turma, setTurma] = useState('');
    const [curso, setCurso] = useState('');
    const [idAlterando, setIdAlterando] = useState(0);

    const ref = useRef(null);
  

    async function listar() {
        ref.current.continuousStart();
        let r = await api.listar();
        setAlunos(r);
        ref.current.complete();
    }

    async function inserir() {

        if(idAlterando === 0) {
            let r = await api.inserir(nome, chamada, curso, turma);
            if (r.erro) 
                toast.error(r.erro);
            else
                toast.success('Aluno inserido!');
        } else {
            let r = await api.alterar(idAlterando, nome, chamada, curso, turma);
            if (r.erro) 
                toast.error(r.erro);
            else
                toast.success('Aluno alterado');
        }
  
        limparCampos();
        listar();
    }

    function limparCampos() {
        setNome('');
        setChamada('');
        setCurso('');
        setTurma('');
        setIdAlterando(0);
    }

    async function remover(id) {

        confirmAlert({ 
            title: 'Remover aluno',
            message: 'Você realmente deseja remover ' + id + '?',
            buttons: [
              {
                label: 'Sim',
                onClick: async () => {
                    let r = await api.remover(id);

                    if (r.erro) {
                        alert(`${r.erro}`)
                        return
                    }

                    toast.success('Aluno removido');
                    listar();
                }
              },
              {
                label: 'Não',
                onClick: () => toast.error('Aluno não removido!')
              }
            ]
        })
    }

    async function editar(item) {
        setNome(item.nm_aluno);
        setChamada(item.nr_chamada);
        setCurso(item.nm_curso);
        setTurma(item.nm_turma);
        setIdAlterando(item.id_matricula);
    }


    // funcao chamada 1x quando a tela abre
    useEffect(() => {
        listar();
    }, [])
    



    return (
        <Container>
            <ToastContainer/>
            <LoadingBar color="red" ref={ref} />
            <Menu />
            <Conteudo>
                <Cabecalho />
                <div class="body-right-box">
                    <div class="new-student-box">
                        
                        <div class="text-new-student">
                            <div class="bar-new-student"></div>
                            <div class="text-new-student"> {idAlterando === 0 ? "Novo Aluno" : "Alterando Aluno" + idAlterando} </div>
                        </div>

                        <div class="input-new-student"> 
                            <div class="input-left">
                                <div class="agp-input"> 
                                    <div class="name-student"> Nome: </div>  
                                    <div class="input"> <input type="text" value={nome} onChange={e => setNome(e.target.value)} /> </div>  
                                </div> 
                                <div class="agp-input">
                                    <div class="number-student"> Chamada: </div>  
                                    <div class="input"> <input type="text" value={chamada} onChange={e => setChamada(e.target.value)} /> </div> 
                                </div>
                            </div>

                            <div class="input-right">
                                <div class="agp-input">
                                    <div class="corse-student"> Curso: </div>  
                                    <div class="input"> <input type="text" value={curso} onChange={e => setCurso(e.target.value)} /> </div>  
                                </div>
                                <div class="agp-input">
                                    <div class="class-student"> Turma: </div>  
                                    <div class="input"> <input type="text" value={turma} onChange={e => setTurma(e.target.value)} /> </div> 
                                </div>
                            </div>
                            <div class="button-create"> <button onClick={inserir}> {idAlterando === 0 ? "cadastrar" : "Alterar"} </button> </div>
                        </div>
                    </div>

                    <div class="student-registered-box">
                        <div class="row-bar"> 
                            <div class="bar-new-student"> </div>
                            <div class="text-registered-student"> Alunos Matriculados </div>
                        </div>
                    
                        <table class ="table-user">
                            <thead>
                                <tr>
                                    <th> ID </th>
                                    <th> Nome </th>
                                    <th> Chamada </th>
                                    <th> Turma </th>
                                    <th> Curso </th>
                                    <th class="coluna-acao"> </th>
                                    <th class="coluna-acao"> </th>
                                </tr>
                            </thead>
                    
                            <tbody>

                               {alunos.map((item, i) =>

                                <tr className={i % 2 ===0 ?"linha-alternada" : ""}>
                                    <td> {item.id_matricula} </td>
                                    <td title={item.nm_aluno}> {item.nm_aluno != null&& item.nm_aluno.length >= 25 ? item.nm_aluno.substr(0, 25) + '...' : item.nm_aluno } </td>
                                    <td> {item.nr_chamada} </td>
                                    <td> {item.nm_turma} </td>
                                    <td> {item.nm_curso} </td>
                                    <td className="coluna-acao"> <button onClick={() => editar(item) } > <img src="/assets/images/edit.svg" alt="" /> </button> </td>
                                    <td className="coluna-acao"> <button onClick={() => remover(item.id_matricula) } > <img src="/assets/images/trash.svg" alt="" /> </button> </td>
                                </tr>

                               )}
                                
                            </tbody> 
                        </table>
                    </div>
                </div>
            </Conteudo>
        </Container>
    )
}
