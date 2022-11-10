import Image from 'next/image';
import { FormEvent, useState } from 'react';
import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import iconCheckImg from '../assets/icon-check.svg';
import logoImg from '../assets/logo.svg';
import usersAvatarImg from '../assets/users-avatar-example.png'
import { api } from '../lib/axios';

interface IndexProps{
  poolCount: number,
  guessCount: number,
  userCount: number
} 

export default function Index(props: IndexProps) {
  const [poolTitle, setPoolTitle] = useState('');

  async function createPool(event: FormEvent){
    event.preventDefault();

    try {
      const response = await api.post('/spools', {
        title: poolTitle,
      });
      
      const { code } = response.data      

      await navigator.clipboard.writeText(code)

      setPoolTitle('');

      alert('Bolão criado com sucesso, o código foi copiado para a área de transferência')
      
    } catch (error) {
      console.log(error)

      alert('Falha ao criar o bolão, tente novamente!')
    }

  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28'>
      <main>
        <Image src={logoImg} alt="nlw copa" />
        <h1 className='mt-14 text-5xl font-bold text-white leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
       <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarImg} alt="usuários que já estão usando o app" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-green-500'>+{props.userCount} </span> 
            {props.userCount > 1 ? 'pessoas já estão usando' : 'pessoa já está usando'}            
          </strong>
       </div>    
      
      <form onSubmit={createPool} className='mt-10 flex gap-2'>
        <input type="text" 
        required name="name-spool" id="" 
        placeholder='Qual nome do seu bolão?' 
        className='flex-1 bg-gray-800 border-gray-600 border rounded px-6 py-4 text-gray-100 text-sm placeholder-gray-200'
        onChange={event => setPoolTitle(event.target.value)}
        value={poolTitle}
        />
        <button type="submit"
                className='bg-yellow-500 rounded px-6 py-4 text-sm text-gray-900 uppercase font-bold hover:bg-yellow-700'
        >Criar meu bolão</button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>
      
      <div className='my-10 pt-10 flex items-center justify-between border-t border-gray-600 text-gray-100'>
        <div className='flex items-center gap-6 '>
          <Image src={iconCheckImg} alt="" />
          <div className='flex flex-col'>
            <span className='text-2xl font-bold'>+{props.poolCount}</span>
            <span className='text-base'>
              {props.poolCount > 1 ? 'Bolões criados' : 'Bolão criado'}
            </span>
          </div>          
        </div>

        <div className="w-px h-14 bg-gray-600 " />
        <div className='flex items-center gap-6'>
          <Image src={iconCheckImg} alt="" />
          <div className='flex flex-col'>
            <span className='text-2xl font-bold'>+{props.guessCount}</span>
            <span className='text-base'>
              {props.guessCount > 1 ? 'Palpites enviados' : 'Palpite enviado'}              
            </span>
          </div>          
        </div>
      </div>
      </main>
      <Image src={appPreviewImg} alt="dois celulares com o app aberto" quality={100}/>
    </div>
  )
}

export const getServerSideProps = async () => {  

  const [poolCountResponse, poolGuessesResponse, userCountResponse] = await Promise.all([
    api.get('spools/count'), 
    api.get('guesses/count'),
    api.get('/users/count')
  ]);

  return{
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: poolGuessesResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}

export async function getStaticProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
