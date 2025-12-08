import React, { useState, useCallback } from 'react'
import { Upload, FileCheck, FileX, Filter, Download } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import useVehicleStore from '../stores/vehicleStore'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

export const DocumentsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const { documents, uploadDocument, approveDocument, rejectDocument } =
    useVehicleStore()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        toast.error('Fichier invalide')
        return
      }

      const file = acceptedFiles[0]

      // Validation de taille
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux (max 10MB)')
        return
      }

      try {
        // Simulation d'upload
        const newDocument = {
          id: Date.now().toString(),
          vehicleId: 'vehicle_1',
          ownerId: 'user_1',
          type: 'insurance' as const,
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
          uploadDate: new Date().toISOString(),
          status: 'pending' as const,
        }

        await uploadDocument(newDocument)
        toast.success('Document uploadé avec succès!')
      } catch (error) {
        toast.error('Erreur lors de l\'upload')
      }
    },
    [uploadDocument]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
  })

  const filteredDocs = documents.filter((doc) => {
    if (filterStatus === 'all') return true
    return doc.status === filterStatus
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-luxury-900">
                Gestion des Documents
              </h1>
              <p className="text-luxury-600 mt-2">
                Validez et organisez les documents des véhicules
              </p>
            </div>

            {/* Upload Zone */}
            <div className="bg-white rounded-xl shadow-luxury p-8 mb-8">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition cursor-pointer ${
                  isDragActive
                    ? 'border-gold-500 bg-gold-50'
                    : 'border-luxury-300 hover:border-gold-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload
                  size={48}
                  className="mx-auto text-gold-500 mb-4"
                />
                <h3 className="text-lg font-semibold text-luxury-900 mb-2">
                  Déposez des documents ici
                </h3>
                <p className="text-luxury-600 mb-2">
                  ou cliquez pour sélectionner
                </p>
                <p className="text-sm text-luxury-500">
                  Format accepté: PDF | Max 10MB
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <Filter size={20} className="text-luxury-600" />
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as 'all' | 'pending' | 'approved' | 'rejected'
                  )
                }
                className="px-4 py-2 border border-luxury-300 rounded-lg text-sm focus:outline-none focus:border-gold-500"
              >
                <option value="all">Tous les documents</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>

            {/* Documents List */}
            <div className="space-y-4">
              {filteredDocs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-luxury p-12 text-center">
                  <p className="text-luxury-600">
                    Aucun document trouvé avec ce filtre
                  </p>
                </div>
              ) : (
                filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-xl shadow-luxury p-6 hover:shadow-luxury-lg transition"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileCheck size={24} className="text-red-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-luxury-900">
                          {doc.fileName}
                        </h3>
                        <p className="text-sm text-luxury-600">
                          Véhicule: {doc.vehicleId} | Uploadé:{' '}
                          {dayjs(doc.uploadDate).format('DD/MM/YYYY HH:mm')}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          doc.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : doc.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {doc.status === 'approved'
                          ? 'Approuvé'
                          : doc.status === 'pending'
                          ? 'En attente'
                          : 'Rejeté'}
                      </span>
                    </div>

                    {/* Actions */}
                    {doc.status === 'pending' && (
                      <div className="flex gap-3 pt-4 border-t border-luxury-200">
                        <button
                          onClick={() => approveDocument(doc.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition"
                        >
                          <FileCheck size={16} />
                          Approuver
                        </button>
                        <button
                          onClick={() =>
                            rejectDocument(
                              doc.id,
                              'Document invalide ou incomplet'
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition"
                        >
                          <FileX size={16} />
                          Rejeter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-luxury-100 text-luxury-700 font-semibold rounded-lg hover:bg-luxury-200 transition ml-auto">
                          <Download size={16} />
                          Télécharger
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DocumentsPage
