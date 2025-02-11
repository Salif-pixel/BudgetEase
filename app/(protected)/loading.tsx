export default function Loading() {
    return (
        <div className={` w-full flex flex-col items-center justify-center h-screen`}>
            <div className={`animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary`}></div>
        </div>
    );
}