import Wrapper from "../../assets/wrappers/peminjamanAlat";
import {  useLoaderData, Form } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import moment from "moment-timezone";

export const loader = async () => {
  try {
    const result = await customFetch.get("v1/peminjaman/alat/diterima", {
      withCredentials: true,
    });
    
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
const DaftarBarangDipinjam = () => {
  const {data} = useLoaderData()
  return (
    <Wrapper>
      <div className="mx-10 my-10 bg-white shadow-lg py-5 px-5 rounded-sm">
        <h1 className="text-biru-uhamka font-bold text-xl text-center">
          Daftar Status Alat Dipinjam
        </h1>
        <div className="overflow-auto">
          <table className="table-auto w-full border border-collapse my-5 text-center text-sm">
            <thead className="border border-collapse bg-gray-100">
              <tr>
                <th className="border p-4">Nama</th>
                <th className="border p-4">NIDN/NIK</th>
                <th className="border p-4">Keperluan</th>
                <th className="border p-4">Jenis Barang</th>
                <th className="border p-4">Tanggal Peminjaman</th>
                <th className="border p-4">Tanggal Pengembalian</th>
                <th></th>
              </tr>
            </thead>

            <tbody className="text-center text-xs">
              {data.map(val=> {
                return (
                  <tr key={val.id}>
                    <td className="border p-2">{val.nama}</td>
                    <td className="border px-2">{val.nidn}</td>
                    <td className="border px-2">{val.keperluan}</td>
                    <td className="border px-2">{val.jenis_barang}</td>
                    <td className="border px-2">
                      {moment
                        .utc(val.tanggal_peminjaman)
                        .tz("Asia/Jakarta")
                        .format("DD/MM/YYYY")}
                    </td>
                    <td className="border px-2">
                      {moment
                        .utc(val.tanggal_pengembalian)
                        .tz("Asia/Jakarta")
                        .format("DD/MM/YYYY")}
                    </td>
                    <td className="p-4 text-white flex items-center text-center justify-center">
                      <Form
                        type="submit"
                        method="post"
                        action={`${val.id}/dikembalikan`}
                      >
                        <button className="flex items-center bg-green-600 rounded-md px-3 py-1 ">
                          Barang Dikembalikan
                        </button>
                      </Form>
                    </td>
                  </tr>
                );
              })}
            
            </tbody>
          </table>
        </div>
      </div>
    </Wrapper>
  );
};
export default DaftarBarangDipinjam;
