"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type SVGProps,
} from "react"
import { AnimatePresence, motion } from "motion/react"

// Define the structure for our logo objects
interface LogoCarousel {
    name: string
    id: number
    img: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

// Utility function to randomly shuffle an array
// This is used to mix up the order of logos for a more dynamic display
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

// Utility function to distribute logos across multiple columns
// This ensures each column has a balanced number of logos
const distributeLogos = (allLogos: LogoCarousel[], columnCount: number): LogoCarousel[][] => {
    const shuffled = shuffleArray(allLogos)
    const columns: LogoCarousel[][] = Array.from({ length: columnCount }, () => [])

    // Distribute logos evenly across columns
    shuffled.forEach((logo, index) => {
        columns[index % columnCount].push(logo)
    })

    // Ensure all columns have the same number of logos by filling shorter columns
    const maxLength = Math.max(...columns.map((col) => col.length))
    columns.forEach((col) => {
        while (col.length < maxLength) {
            col.push(shuffled[Math.floor(Math.random() * shuffled.length)])
        }
    })

    return columns
}

// Props for the LogoColumn component
interface LogoColumnProps {
    logos: LogoCarousel[]
    index: number
    currentTime: number
}

// LogoColumn component: Displays a single column of animated logos
// eslint-disable-next-line react/display-name
const LogoColumn: React.FC<LogoColumnProps> = React.memo(
    ({ logos, index, currentTime }) => {
        const cycleInterval = 2000 // Time each logo is displayed (in milliseconds)
        const columnDelay = index * 200 // Stagger the start of each column's animation
        // Calculate which logo should be displayed based on the current time
        const adjustedTime =
            (currentTime + columnDelay) % (cycleInterval * logos.length)
        const currentIndex = Math.floor(adjustedTime / cycleInterval)

        // Memoize the current logo to prevent unnecessary re-renders
        const CurrentLogo = useMemo(
            () => logos[currentIndex].img,
            [logos, currentIndex]
        )

        return (
            // Framer Motion component for the column container
            <motion.div
                className="w-24 h-14 md:w-48 md:h-24 overflow-hidden relative"
                initial={{ opacity: 0, y: 50 }} // Start invisible and below final position
                animate={{ opacity: 1, y: 0 }} // Animate to full opacity and final position
                transition={{
                    delay: index * 0.1, // Stagger the animation of each column
                    duration: 0.5,
                    ease: "easeOut",
                }}
            >
                {/* AnimatePresence enables animation of components that are removed from the DOM */}
                <AnimatePresence mode="wait">
                    {/* Framer Motion component for each logo */}
                    <motion.div
                        key={`${logos[currentIndex].id}-${currentIndex}`}
                        className="absolute inset-0 flex items-center justify-center"
                        // Animation for when the logo enters
                        initial={{ y: "10%", opacity: 0, filter: "blur(8px)" }}
                        // Animation for when the logo is displayed
                        animate={{
                            y: "0%",
                            opacity: 1,
                            filter: "blur(0px)",
                            transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                mass: 1,
                                bounce: 0.2,
                                duration: 0.5,
                            },
                        }}
                        // Animation for when the logo exits
                        exit={{
                            y: "-20%",
                            opacity: 0,
                            filter: "blur(6px)",
                            transition: {
                                type: "tween",
                                ease: "easeIn",
                                duration: 0.3,
                            },
                        }}
                    >
                        <CurrentLogo className="w-20 h-20 md:w-32 md:h-32 max-w-[80%] max-h-[80%] object-contain" />
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        )
    }
)

// Main LogoCarousel component
function LogoCarousel({ columnCount = 2 }: { columnCount?: number }) {
    const [logoSets, setLogoSets] = useState<LogoCarousel[][]>([])
    const [currentTime, setCurrentTime] = useState(0)

    // Memoize the array of logos to prevent unnecessary re-renders
    const allLogos: LogoCarousel[] = useMemo(
        () => [
            { name: "Apple", id: 1, img: AppleIcon },
            { name: "Framer motion", id: 2, img: Motion },
            { name: "Vercel", id: 3, img: VercelIcon },
            { name: "TurboPack", id: 3, img: TurboPackIcon },
            { name: "DotEnv", id: 3, img: dotenv },
            { name: "Nextjs", id: 9, img: NextjsIcon },
            { name: "Prisma", id: 9, img: Prisma },
            { name: "Tailwind", id: 10, img: TailwindCSSIcon },
            { name: "Typescript", id: 12, img: TypeScriptIcon },
            { name: "Zod", id: 13, img: Zod },
            { name: "V0", id: 13, img: v0 },
            { name: "OpenAI", id: 14, img: OpenAIIconBlack },
        ],
        []
    )

    // Distribute logos across columns when the component mounts
    useEffect(() => {
        const distributedLogos = distributeLogos(allLogos, columnCount)
        setLogoSets(distributedLogos)
    }, [allLogos, columnCount])

    // Function to update the current time (used for logo cycling)
    const updateTime = useCallback(() => {
        setCurrentTime((prevTime) => prevTime + 100)
    }, [])

    // Set up an interval to update the time every 100ms
    useEffect(() => {
        const intervalId = setInterval(updateTime, 100)
        return () => clearInterval(intervalId)
    }, [updateTime])

    // Render the logo columns
    return (
        <div className="flex space-x-4">
            {logoSets.map((logos, index) => (
                <LogoColumn
                    key={index}
                    logos={logos}
                    index={index}
                    currentTime={currentTime}
                />
            ))}
        </div>
    )
}

function AppleIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="209"
            height="256"
            viewBox="0 0 814 1000"
            {...props}
        >
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
        </svg>
    )
}

const dotenv = (props: SVGProps<SVGSVGElement>) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" {...props}><title>{".ENV"}</title><rect width={24} height={24} fill="#09090B" /><path fill="#ECD53F" d="M24 0v24H0V0h24ZM10.933 15.89H6.84v5.52h4.198v-.93H7.955v-1.503h2.77v-.93h-2.77v-1.224h2.978v-.934Zm2.146 0h-1.084v5.52h1.035v-3.6l2.226 3.6h1.118v-5.52h-1.036v3.686l-2.259-3.687Zm5.117 0h-1.208l1.973 5.52h1.19l1.976-5.52h-1.182l-1.352 4.085-1.397-4.086ZM5.4 19.68H3.72v1.68H5.4v-1.68Z" /></svg>;



function TurboPackIcon() {
    return (
        <svg  viewBox="0 0 256 318" width="209" height="80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><defs><linearGradient x1="123.779%" y1="0%" x2="123.779%" y2="698.962%" id="a"><stop stopColor="#1E90FF" offset="0%"/><stop stopColor="#FF1E56" offset="100%"/></linearGradient><linearGradient x1="11.486%" y1="-2.194%" x2="11.486%" y2="512.398%" id="b"><stop stopColor="#1E90FF" offset="0%"/><stop stopColor="#FF1E56" offset="100%"/></linearGradient><linearGradient x1="-153.743%" y1="-62.263%" x2="-153.743%" y2="278.479%" id="c"><stop stopColor="#1E90FF" offset="0%"/><stop stopColor="#FF1E56" offset="100%"/></linearGradient><linearGradient x1="-153.743%" y1="-178.48%" x2="-153.743%" y2="162.264%" id="d"><stop stopColor="#1E90FF" offset="0%"/><stop stopColor="#FF1E56" offset="100%"/></linearGradient><linearGradient x1="11.486%" y1="-412.397%" x2="11.486%" y2="102.194%" id="e"><stop stopColor="#1E90FF" offset="0%"/><stop stopColor="#FF1E56" offset="100%"/></linearGradient><linearGradient x1="123.779%" y1="-598.961%" x2="123.779%" y2="100%" id="f"><stop stopColor="#1E90FF" offset="0%"/><stop stopColor="#FF1E56" offset="100%"/></linearGradient></defs><path d="M103.41.095C66.837-1.166 30.268 10.183 0 34.144l20.177 11.35c23.962-17.656 54.226-25.222 83.233-23.961V.095Z" fill="url(#a)"/><path d="M210.6 48.016c-25.222-26.483-58.01-42.877-93.319-46.66v21.438c30.268 5.044 56.75 18.916 78.188 40.355L210.6 48.016Z" fill="url(#b)"/><path d="M256 151.424c-1.26-32.788-13.871-65.576-35.309-93.32l-15.136 15.133c17.657 23.96 27.747 50.444 29.008 78.187H256Z" fill="url(#c)"/><path d="M220.691 259.877c21.438-27.744 34.049-60.532 35.309-93.32h-21.437c-1.26 27.744-11.351 54.227-29.008 78.187l15.136 15.133Z" fill="url(#d)"/><path d="M117.281 316.626c34.049-3.783 68.097-20.178 93.32-46.66l-15.132-15.133c-21.437 22.7-49.185 36.571-78.188 40.354v21.439Z" fill="url(#e)"/><path d="M0 283.838c30.268 23.96 66.837 35.31 103.41 34.049v-21.439c-29.007 1.262-58.01-6.305-83.233-23.96L0 283.838Z" fill="url(#f)"/><path d="M97.651 71.344c13.479 0 25.919 2.295 37.321 6.886 11.402 4.443 21.177 10.663 29.324 18.66 8.292 7.998 14.734 17.402 19.326 28.214 4.593 10.663 6.887 22.214 6.887 34.655 0 12.44-2.294 24.066-6.887 34.877-4.592 10.663-11.034 19.993-19.326 27.99-8.147 7.998-17.922 14.292-29.324 18.883-11.402 4.443-23.842 6.665-37.32 6.665-13.625 0-26.142-2.222-37.544-6.665-11.257-4.591-20.954-10.885-29.101-18.882-8.147-7.998-14.513-17.328-19.105-27.991-4.592-10.811-6.887-22.437-6.887-34.877 0-12.44 2.295-23.992 6.887-34.655 4.592-10.812 10.958-20.216 19.105-28.213 8.147-7.998 17.844-14.218 29.101-18.66 11.402-4.592 23.92-6.887 37.543-6.887Zm0 42.208c-6.37 0-12.44 1.184-18.216 3.554-5.626 2.222-10.59 5.406-14.884 9.553-4.293 4.146-7.702 9.034-10.219 14.661-2.516 5.628-3.776 11.774-3.776 18.439 0 6.664 1.26 12.81 3.776 18.438 2.517 5.628 5.926 10.515 10.22 14.662 4.293 4.147 9.257 7.404 14.883 9.774 5.776 2.222 11.846 3.332 18.216 3.332 6.37 0 12.368-1.11 17.994-3.332 5.776-2.37 10.813-5.627 15.106-9.774 4.443-4.147 7.925-9.034 10.441-14.662 2.516-5.628 3.777-11.774 3.777-18.438 0-6.665-1.26-12.811-3.777-18.439-2.516-5.627-5.998-10.515-10.44-14.661-4.294-4.147-9.331-7.331-15.107-9.553-5.626-2.37-11.624-3.554-17.994-3.554Z"/></svg>
    )
}

const Motion = (props: SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1103 386" width="1em" height="1em" {...props}><path fill="#FFF312" d="M416.473 0 198.54 385.66H0L170.17 84.522C196.549 37.842 262.377 0 317.203 0Zm486.875 96.415c0-53.249 44.444-96.415 99.27-96.415 54.826 0 99.27 43.166 99.27 96.415 0 53.248-44.444 96.415-99.27 96.415-54.826 0-99.27-43.167-99.27-96.415ZM453.699 0h198.54L434.306 385.66h-198.54Zm234.492 0h198.542L716.56 301.138c-26.378 46.68-92.207 84.522-147.032 84.522h-99.27Z" /></svg>;

const Prisma = (props: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 256 310" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" {...props}><path fill="#fff" d="M254.313 235.519L148 9.749A17.063 17.063 0 00133.473.037a16.87 16.87 0 00-15.533 8.052L2.633 194.848a17.465 17.465 0 00.193 18.747L59.2 300.896a18.13 18.13 0 0020.363 7.489l163.599-48.392a17.929 17.929 0 0011.26-9.722 17.542 17.542 0 00-.101-14.76l-.008.008zm-23.802 9.683l-138.823 41.05c-4.235 1.26-8.3-2.411-7.419-6.685l49.598-237.484c.927-4.443 7.063-5.147 9.003-1.035l91.814 194.973a6.63 6.63 0 01-4.18 9.18h.007z" /></svg>;
const Zod = (props: SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 256 203" {...props}><defs><filter id="a" width="105.2%" height="106.5%" x="-2.2%" y="-2.8%" filterUnits="objectBoundingBox"><feOffset dx={1} dy={1} in="SourceAlpha" result="shadowOffsetOuter1" /><feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation={2} /><feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.36 0" /></filter><path id="b" d="M200.42 0H53.63L0 53.355l121.76 146.624 9.714-10.9L252 53.857 200.42 0Zm-5.362 12.562 39.84 41.6-112.8 126.558L17 54.162l41.815-41.6h136.243Z" /></defs><path fill="#18253F" d="M60.816 14.033h136.278l39.933 41.69-112.989 126.554L18.957 55.724z" /><path fill="#274D82" d="M151.427 152.386H98.013l-24.124-29.534 68.364-.002.002-4.19h39.078z" /><path fill="#274D82" d="m225.56 43.834-147.382 85.09-19.226-24.051 114.099-65.877-2.096-3.631 30.391-17.546zM146.596 14.075 35.93 77.968 18.719 56.483l74.095-42.78z" /><g transform="translate(2 1.51)"><use xlinkHref="#b" filter="url(#a)" /><use xlinkHref="#b" fill="#3068B7" /></g></svg>;


const v0 = (props: SVGProps<SVGSVGElement>) => <svg height="1em" xmlns="http://www.w3.org/2000/svg" strokeLinejoin="round" viewBox="0 0 16 16" width="1em" {...props}><path clipRule="evenodd" d="M9.50321 5.5H13.2532C13.3123 5.5 13.3704 5.5041 13.4273 5.51203L9.51242 9.42692C9.50424 9.36912 9.5 9.31006 9.5 9.25L9.5 5.5L8 5.5L8 9.25C8 10.7688 9.23122 12 10.75 12H14.5V10.5L10.75 10.5C10.6899 10.5 10.6309 10.4958 10.5731 10.4876L14.4904 6.57028C14.4988 6.62897 14.5032 6.68897 14.5032 6.75V10.5H16.0032V6.75C16.0032 5.23122 14.772 4 13.2532 4H9.50321V5.5ZM0 5V5.00405L5.12525 11.5307C5.74119 12.3151 7.00106 11.8795 7.00106 10.8822V5H5.50106V9.58056L1.90404 5H0Z" fill="white" fillRule="evenodd" /></svg>;


function VercelIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 256 222"
            width="256"
            height="222"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
            {...props}
        >
            <path fill="#000" d="m128 0 128 221.705H0z" />
        </svg>
    )
}



const TypeScriptIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 256 256"
        width={256}
        height={256}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
        {...props}
    >
        <path
            d="M20 0h216c11.046 0 20 8.954 20 20v216c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V20C0 8.954 8.954 0 20 0Z"
            fill="#3178C6"
        />
        <path
            d="M150.518 200.475v27.62c4.492 2.302 9.805 4.028 15.938 5.179 6.133 1.151 12.597 1.726 19.393 1.726 6.622 0 12.914-.633 18.874-1.899 5.96-1.266 11.187-3.352 15.678-6.257 4.492-2.906 8.048-6.704 10.669-11.394 2.62-4.689 3.93-10.486 3.93-17.391 0-5.006-.749-9.394-2.246-13.163a30.748 30.748 0 0 0-6.479-10.055c-2.821-2.935-6.205-5.567-10.149-7.898-3.945-2.33-8.394-4.531-13.347-6.602-3.628-1.497-6.881-2.949-9.761-4.359-2.879-1.41-5.327-2.848-7.342-4.316-2.016-1.467-3.571-3.021-4.665-4.661-1.094-1.64-1.641-3.495-1.641-5.567 0-1.899.489-3.61 1.468-5.135s2.362-2.834 4.147-3.927c1.785-1.094 3.973-1.942 6.565-2.547 2.591-.604 5.471-.906 8.638-.906 2.304 0 4.737.173 7.299.518 2.563.345 5.14.877 7.732 1.597a53.669 53.669 0 0 1 7.558 2.719 41.7 41.7 0 0 1 6.781 3.797v-25.807c-4.204-1.611-8.797-2.805-13.778-3.582-4.981-.777-10.697-1.165-17.147-1.165-6.565 0-12.784.705-18.658 2.115-5.874 1.409-11.043 3.61-15.506 6.602-4.463 2.993-7.99 6.805-10.582 11.437-2.591 4.632-3.887 10.17-3.887 16.615 0 8.228 2.375 15.248 7.127 21.06 4.751 5.811 11.963 10.731 21.638 14.759a291.458 291.458 0 0 1 10.625 4.575c3.283 1.496 6.119 3.049 8.509 4.66 2.39 1.611 4.276 3.366 5.658 5.265 1.382 1.899 2.073 4.057 2.073 6.474a9.901 9.901 0 0 1-1.296 4.963c-.863 1.524-2.174 2.848-3.93 3.97-1.756 1.122-3.945 1.999-6.565 2.632-2.62.633-5.687.95-9.2.95-5.989 0-11.92-1.05-17.794-3.151-5.875-2.1-11.317-5.25-16.327-9.451Zm-46.036-68.733H140V109H41v22.742h35.345V233h28.137V131.742Z"
            fill="#FFF"
        />
    </svg>
)




function OpenAIIconBlack(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="256"
            height="260"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 260"
            {...props}
        >
            <path
                className="fill-black"
                d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
            />
        </svg>
    )
}


const TailwindCSSIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 54 33"
        {...props}
    >
        <g clipPath="url(#prefix__clip0)">
            <path
                fill="#38bdf8"
                fillRule="evenodd"
                d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
                clipRule="evenodd"
            />
        </g>
        <defs>
            <clipPath id="prefix__clip0">
                <path fill="#fff" d="M0 0h54v32.4H0z" />
            </clipPath>
        </defs>
    </svg>
)

const NextjsIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={180}
        height={180}
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <mask
            id="mask0_408_139"
            style={{
                maskType: "alpha",
            }}
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={180}
            height={180}
        >
            <circle cx={90} cy={90} r={90} fill="black" />
        </mask>
        <g mask="url(#mask0_408_139)">
            <circle
                cx={90}
                cy={90}
                r={87}
                fill="black"
                stroke="white"
                strokeWidth={6}
            />
            <path
                d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
                fill="url(#paint0_linear_408_139)"
            />
            <rect
                x={115}
                y={54}
                width={12}
                height={72}
                fill="url(#paint1_linear_408_139)"
            />
        </g>
        <defs>
            <linearGradient
                id="paint0_linear_408_139"
                x1={109}
                y1={116.5}
                x2={144.5}
                y2={160.5}
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="white" />
                <stop offset={1} stopColor="white" stopOpacity={0} />
            </linearGradient>
            <linearGradient
                id="paint1_linear_408_139"
                x1={121}
                y1={54}
                x2={120.799}
                y2={106.875}
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="white" />
                <stop offset={1} stopColor="white" stopOpacity={0} />
            </linearGradient>
        </defs>
    </svg>
)

export { LogoCarousel }
