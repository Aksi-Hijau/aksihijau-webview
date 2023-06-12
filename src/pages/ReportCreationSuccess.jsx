import successGraph from '../assets/success-report.svg'

const ReportCreationSuccess = () => {
  return (
    <div className="max-w-[430px] mx-auto border min-h-screen p-4 bg-tertiary space-y-4">
      <img src={successGraph} height="700" width="700" alt="" />
      <h4 className='text-xl text-center font-semibold text-primary'>Berhasil membuat kabar terbaru</h4>
    </div>
  )
}

export default ReportCreationSuccess