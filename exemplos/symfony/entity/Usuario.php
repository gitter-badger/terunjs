<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Condutor
 *
 * @ORM\Table(name="condutor")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\CondutorRepository")
 */
class Condutor
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @Assert\Length(
     *      min = 2,
     *      max = 100
     * )
     * @ORM\Column(name="nome", type="string", length=100)
     */
    private $nome;

    /**
     * @var string
     *
     * @Assert\Length(
     *      min = 2,
     *      max = 200
     * )
     * @ORM\Column(name="sobrenome", type="string", length=200)
     */
    private $sobrenome;


    /**
     * @var string
     * @Assert\Length(
     *      max = 11
     * )
     * @ORM\Column(name="cpf", type="string", length=11, nullable=true)
     */
    private $cpf;

    /**
     * @var \DateTime
     * @Assert\Date()
     * @ORM\Column(name="data_nascimento", type="date")
     */
    private $dataNascimento;

    /**
     * @var string
     * @Assert\Email()
     * @ORM\Column(name="usuario", type="string", length=200, nullable=true, unique=true)
     */
    private $email;

    /**
     * @var string
     *
     * @ORM\Column(name="senha", type="string", length=200, nullable=true)
     */
    private $senha;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\CondutorPerfil")
     */
    private $condutorPerfil;

    /**
     * @var json
     *
     * @ORM\Column(name="json_cerca_residencia", type="json", length=1000, nullable=true)
     */
    private $jsonCercaResidencia;

    /**
     * @var json
     *
     * @ORM\Column(name="json_cerca_trabalho", type="json", length=1000, nullable=true)
     */
    private $jsonCercaTrabalho;

    /**
     * @var string
     * @Assert\Length(
     *      max = 255
     * )
     * @ORM\Column(name="logradouro", type="string", length=255, options={"default":""})
     */
    private $logradouro;

    /**
     * @var string
     * @Assert\Length(
     *      max = 255
     * )
     * @ORM\Column(name="complemento", type="string", length=255, nullable=true)
     */
    private $complemento;

    /**
     * @var int
     * @Assert\Type(
     *     type="integer",
     *     message="O valor não é um numero válido."
     * )
     * @ORM\Column(name="numero", type="integer", nullable=true, options={"default":0})
     */
    private $numero;

    /**
     * @var string
     * @Assert\Length(max = 255)
     * @ORM\Column(name="bairro", type="string", length=255, options={"default":""})
     */
    private $bairro;

    /**
     * @var string
     * @Assert\Length(
     *      max = 15
     * )
     * @ORM\Column(name="cep", type="string", length=15, options={"default":""})
     */
    private $cep;

    /**
     * @var string
     * @Assert\Length(
     *      max = 255
     * )
     * @ORM\Column(name="logradouro_trabalho", type="string", length=255, options={"default":""})
     */
    private $logradouroTrabalho;

    /**
     * @var string
     * @Assert\Length(
     *      max = 255
     * )
     * @ORM\Column(name="complemento_trabalho", type="string", length=255, nullable=true)
     */
    private $complementoTrabalho;

    /**
     * @var int
     * @Assert\Type(
     *     type="integer",
     *     message="O valor não é um numero válido."
     * )
     * @ORM\Column(name="numero_trabalho", type="integer", nullable=true, options={"default":0})
     */
    private $numeroTrabalho;

    /**
     * @var string
     * @Assert\Length(max = 255)
     * @ORM\Column(name="bairro_trabalho", type="string", length=255, options={"default":""})
     */
    private $bairroTrabalho;

    /**
     * @var string
     * @Assert\Length(
     *      max = 15
     * )
     * @ORM\Column(name="cep_trabalho", type="string", length=15, options={"default":""})
     */
    private $cepTrabalho;

    /**
     * @var integer
     *
     * @ORM\Column(name="status_cercas", type="integer", nullable=true)
     */
    private $statusCercasCriadas;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="data_exclusao", type="date", nullable=true)
     */
    private $dataExclusao;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set nome
     *
     * @param string $nome
     *
     * @return Condutor
     */
    public function setNome($nome)
    {
        $this->nome = $nome;

        return $this;
    }

    /**
     * Get nome
     *
     * @return string
     */
    public function getNome()
    {
        return $this->nome;
    }

    /**
     * Set sobrenome
     *
     * @param string $sobrenome
     *
     * @return Condutor
     */
    public function setSobrenome($sobrenome)
    {
        $this->sobrenome = $sobrenome;

        return $this;
    }

    /**
     * Get sobrenome
     *
     * @return string
     */
    public function getSobrenome()
    {
        return $this->sobrenome;
    }


    /**
     * Set cpf
     *
     * @param string $cpf
     *
     * @return Condutor
     */
    public function setCpf($cpf)
    {
        $this->cpf = $cpf;

        return $this;
    }

    /**
     * Get cpf
     *
     * @return string
     */
    public function getCpf()
    {
        return $this->cpf;
    }



    /**
     * Set dataNascimento
     *
     * @param \DateTime $dataNascimento
     *
     * @return Condutor
     */
    public function setDataNascimento($dataNascimento)
    {
        $this->dataNascimento = $dataNascimento;

        return $this;
    }

    /**
     * Get dataNascimento
     *
     * @return \DateTime
     */
    public function getDataNascimento()
    {
        return $this->dataNascimento;
    }

    /**
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param string $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * @return string
     */
    public function getSenha()
    {
        return $this->senha;
    }

    /**
     * @param string $senha
     */
    public function setSenha($senha)
    {
        $this->senha = $senha;
    }

    /**
     * @return mixed
     */
    public function getCondutorPerfil()
    {
        return $this->condutorPerfil;
    }

    /**
     * @param mixed $condutorPerfil
     */
    public function setCondutorPerfil($condutorPerfil)
    {
        $this->condutorPerfil = $condutorPerfil;
    }

    /**
     * @return json
     */
    public function getJsonCercaResidencia()
    {
        return $this->jsonCercaResidencia;
    }

    /**
     * @param json $jsonCercaResidencia
     */
    public function setJsonCercaResidencia($jsonCercaResidencia)
    {
        $this->jsonCercaResidencia = $jsonCercaResidencia;
    }

    /**
     * @return json
     */
    public function getJsonCercaTrabalho()
    {
        return $this->jsonCercaTrabalho;
    }

    /**
     * @param json $jsonCercaTrabalho
     */
    public function setJsonCercaTrabalho($jsonCercaTrabalho)
    {
        $this->jsonCercaTrabalho = $jsonCercaTrabalho;
    }

    /**
     * @return string
     */
    public function getLogradouro()
    {
        return $this->logradouro;
    }

    /**
     * @param string $logradouro
     */
    public function setLogradouro($logradouro)
    {
        $this->logradouro = $logradouro;
    }

    /**
     * @return string
     */
    public function getComplemento()
    {
        return $this->complemento;
    }

    /**
     * @param string $complemento
     */
    public function setComplemento($complemento)
    {
        $this->complemento = $complemento;
    }

    /**
     * @return int
     */
    public function getNumero()
    {
        return $this->numero;
    }

    /**
     * @param int $numero
     */
    public function setNumero($numero)
    {
        $this->numero = $numero;
    }

    /**
     * @return string
     */
    public function getBairro()
    {
        return $this->bairro;
    }

    /**
     * @param string $bairro
     */
    public function setBairro($bairro)
    {
        $this->bairro = $bairro;
    }

    /**
     * @return string
     */
    public function getCep()
    {
        return $this->cep;
    }

    /**
     * @param string $cep
     */
    public function setCep($cep)
    {
        $this->cep = $cep;
    }

    /**
     * @return string
     */
    public function getLogradouroTrabalho()
    {
        return $this->logradouroTrabalho;
    }

    /**
     * @param string $logradouroTrabalho
     */
    public function setLogradouroTrabalho($logradouroTrabalho)
    {
        $this->logradouroTrabalho = $logradouroTrabalho;
    }

    /**
     * @return string
     */
    public function getComplementoTrabalho()
    {
        return $this->complementoTrabalho;
    }

    /**
     * @param string $complementoTrabalho
     */
    public function setComplementoTrabalho($complementoTrabalho)
    {
        $this->complementoTrabalho = $complementoTrabalho;
    }

    /**
     * @return int
     */
    public function getNumeroTrabalho()
    {
        return $this->numeroTrabalho;
    }

    /**
     * @param int $numeroTrabalho
     */
    public function setNumeroTrabalho($numeroTrabalho)
    {
        $this->numeroTrabalho = $numeroTrabalho;
    }

    /**
     * @return string
     */
    public function getBairroTrabalho()
    {
        return $this->bairroTrabalho;
    }

    /**
     * @param string $bairroTrabalho
     */
    public function setBairroTrabalho($bairroTrabalho)
    {
        $this->bairroTrabalho = $bairroTrabalho;
    }

    /**
     * @return string
     */
    public function getCepTrabalho()
    {
        return $this->cepTrabalho;
    }

    /**
     * @param string $cepTrabalho
     */
    public function setCepTrabalho($cepTrabalho)
    {
        $this->cepTrabalho = $cepTrabalho;
    }

    /**
     * @return int
     */
    public function getStatusCercasCriadas()
    {
        return $this->statusCercasCriadas;
    }

    /**
     * @param int $statusCercasCriadas
     */
    public function setStatusCercasCriadas($statusCercasCriadas)
    {
        $this->statusCercasCriadas = $statusCercasCriadas;
    }

    /**
     * @return \DateTime
     */
    public function getDataExclusao()
    {
        return $this->dataExclusao;
    }

    /**
     * @param \DateTime $dataExclusao
     */
    public function setDataExclusao($dataExclusao)
    {
        $this->dataExclusao = $dataExclusao;
    }

    public function __toString()
    {
        return (string) $this->getNome();
    }

}