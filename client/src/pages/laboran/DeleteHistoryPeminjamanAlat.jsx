import { redirect } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
export const action = async ({ params }) => {
  try {
    await customFetch.delete(`v1/peminjaman/alat/history/${params.idPeminjaman}`, {
      withCredentials: true,
    });
    toast.error("History Berhasil Dihapus!");
    return redirect(`/admin/dashboard-laboran/${params.id}/peminjaman/history-peminjaman-alat`);
  } catch (error) {
    console.log(error);
    return error;
  }
};
const DeleteHistoryPeminjamanAlat = () => {
  return <div>DeleteHistoryPeminjamanAlat</div>;
};
export default DeleteHistoryPeminjamanAlat;
