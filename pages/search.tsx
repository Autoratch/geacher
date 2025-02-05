import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'


import Checkbox from '../components/Checkbox'
import TutorCard from '../components/TutorCard'

type Tutor = {
    firstname: string
    lastname: string
    subjects: string[]
    batch: number
    poster: string
    id: string
    tel?: string
    ig?: string
    line?: string
    fb?: string
}

const Search = ({ tutors, tutorStat }) => {

    const subjectList = []

    tutorStat.forEach((data) => {
        subjectList.push(data.name)
    })

    const [subjectCheck, setSubjectCheck] = useState(new Map())

    const [matchedTutor, setMatchedTutor] = useState()

    const [reload, setReload] = useState(false)

    useEffect(() => {
        const { sub } = router.query

        let newSubjectCheck = subjectCheck
        newSubjectCheck.set(sub, true)
        setSubjectCheck(newSubjectCheck)
    }, [])

    useEffect(() => {

        let allUncheck = true

        subjectList.forEach((subjectName) => {
            if (subjectCheck.get(subjectName)) {
                allUncheck = false
            }
        })

        const newMatchedTutor = tutors.map((tutor: Tutor) => {
            let match = true

            subjectList.forEach((subjectName) => {
                if (subjectCheck.get(subjectName)) {
                    console.log(tutor.subjects)
                    if (tutor.subjects.lastIndexOf(subjectName) === -1) {
                        match = false
                    }
                }
            })


            if (match || allUncheck)
                return (
                    <TutorCard firstname={tutor.firstname} lastname={tutor.lastname} poster={tutor.poster} id={tutor.id} />
                )
        })
        setMatchedTutor(newMatchedTutor)
        return () => {

        }
    }, [subjectCheck, reload])

    const router = useRouter()





    return (
        <div className=" transition-all flex min-h-screen flex-col items-center justify-begin py-2 bg-gray-900">
            <Head>
                <title>Find your tutor | Geacher</title>
                <link rel="icon" href="/icon.jpg" />


                <meta property="og:url" content="https://geacher.vercel.app/search" />

                <meta property="og:title" content="Find your tutor | Geacher" />

                <meta property="twitter:card" content="summary" />

            </Head>

            <main className=" text-white font-Prompt max-w-4xl  flex w-full flex-col items-center justify-start px-10  md:px-20 text-left">
                <div className='right-14 md:right-40 -top-2 absolute'>
                    <div className='z-10 absolute w-12 h-12 rounded-full animate-v-move' style={{ backgroundImage: "linear-gradient(135deg, #fdba74, #f97316)" }}>
                    </div>
                </div>

                <a href="../" className='text-white text-md font-Prompt underline mb-4 mt-6'>{"ย้อนกลับ"}</a>
                <h1 className='z-20 text-2xl md:text-3xl my-8 text-pink-500'>
                    ค้นหาติวเตอร์สำหรับคุณ
                </h1>
                <div className='grid grid-cols-3 gap-4'>
                    <div className='col-span-1 flex flex-col justify-center items-center border-r-2'>
                        <h1 className='text-lg '>
                            วิชา
                        </h1>
                    </div>
                    <div className='col-span-2 flex flex-col'>
                        {
                            subjectList.map((subject, idx) => {
                                return <Checkbox label={subject} onCheckboxChange={() => {
                                    let newSubjectCheck = subjectCheck
                                    newSubjectCheck.set(subject, !newSubjectCheck.get(subject))
                                    setSubjectCheck(newSubjectCheck)
                                    setReload(!reload)
                                }} isSelected={subjectCheck.get(subject) == 0 ? false : subjectCheck.get(subject)} />
                            })
                        }

                    </div>

                </div>

            </main>

            <section className='flex justify-center mt-12 mb-6 px-10 md:px-20 w-full'>
                <div className='w-full flex justify-center'>
                    <div className='flex flex-row flex-wrap justify-center items-center gap-6'>
                        {
                            matchedTutor
                        }
                    </div>
                </div>
            </section>
            <footer className="text-white flex h-24 w-full items-center justify-center border-t">
                <a
                    className="flex items-center justify-center gap-2"
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                </a>
            </footer>
        </div >
    )
}

export async function getServerSideProps() {
    // Fetch data from external API

    const res = await fetch(`https://geacher.vercel.app/api/getTutors`)
    const tutors = await res.json()

    const res2 = await fetch(`https://geacher.vercel.app/api/getTutorStat`)
    const tutorStat = await res2.json()



    return { props: { tutors, tutorStat } }
}


export default Search
