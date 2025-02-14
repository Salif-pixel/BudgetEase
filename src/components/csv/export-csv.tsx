
import Papa from "papaparse";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { User, Role, Department } from '@prisma/client';
import {Request} from "@prisma/client";

export function exportToCSV<T>(data: T[], filename = "export.csv") {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
}



// Type pour les données d'export
export type UserExportRowType = {
    id: string;
    nom: string;
    email: string;
    role: Role | null;
    departement: Department | null;
    email_verifie: string;
    date_creation: string;
    derniere_modification: string;
    nombre_requetes: number;
};

// Traduction des rôles pour l'export
const roleTranslations: Record<Role, string> = {
    ADMIN: 'Administrateur',
    DIRECTOR: 'Directeur',
    DEPARTMENT_HEAD: 'Chef de departement',
    PERSONAL: 'Personnel'
};

// Traduction des départements pour l'export
const departmentTranslations: Record<Department, string> = {
    INFORMATIQUE: 'Informatique',
    CIVIL: 'Génie Civil',
    ELECTRICITE: 'Électricité',
    MECANIQUE: 'Mécanique',
    GESTION: 'Gestion',
    NO: 'Non Assigné'
};

export const exportUsersToExcel = (users: (User & { Request: Request[] })[]) => {
    // Transformation des données
    const formattedData: UserExportRowType[] = users.map(user => ({
        id: '',
        nom: user.name || 'Non spécifié',
        email: user.email,
        role: user.role,
        departement: user.department,
        email_verifie: user.emailVerified ? 'Oui' : 'Non',
        date_creation: user.createdAt.toLocaleString('fr-FR'),
        derniere_modification: user.updatedAt.toLocaleString('fr-FR'),
        nombre_requetes: user.Request.length
    }));

    // Création du workbook et de la feuille Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Utilisateurs');

    // Définition des colonnes
    worksheet.columns = [
        { header: 'Nom', key: 'nom', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Rôle', key: 'role', width: 15 },
        { header: 'Département', key: 'departement', width: 20 },
        { header: 'Email Vérifié', key: 'email_verifie', width: 15 },
        { header: 'Date de création', key: 'date_creation', width: 20 },
        { header: 'Dernière modification', key: 'derniere_modification', width: 20 },
        { header: 'Nombre de requêtes', key: 'nombre_requetes', width: 20 }
    ];

    // Style des en-têtes
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '2563EB' } // Bleu
        };
        cell.font = {
            bold: true,
            color: { argb: 'FFFFFF' },
            size: 12
        };
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    // Ajout des données avec formatage
    formattedData.forEach((user) => {
        const row = worksheet.addRow({
            ...user,
            role: user.role ? roleTranslations[user.role] : 'Non défini',
            departement: user.departement ? departmentTranslations[user.departement] : 'Non défini'
        });

        // Style pour chaque cellule de données
        row.eachCell((cell) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            // Style alterné pour les lignes
            if (row.number % 2 === 0) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F9FAFB' } // Gris très clair
                };
            }
        });

        // Coloration spéciale pour certains rôles
        const roleCell = row.getCell(4); // Colonne du rôle
        if (user.role === 'ADMIN') {
            roleCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FDE68A' } // Jaune doux
            };
        } else if (user.role === 'DIRECTOR') {
            roleCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'BBF7D0' } // Vert doux
            };
        }
    });

    // Ajout des statistiques en bas
    worksheet.addRow([]); // Ligne vide

    const statsRow = worksheet.addRow({
        id: 'STATISTIQUES',
        nom: `Total utilisateurs: ${formattedData.length}`,
        email: `Emails vérifiés: ${formattedData.filter(u => u.email_verifie === 'Oui').length}`,
        role: `Admins: ${formattedData.filter(u => u.role === 'ADMIN').length}`,
        departement: `Directeurs: ${formattedData.filter(u => u.role === 'DIRECTOR').length}`,
        email_verifie: `Validateurs: ${formattedData.filter(u => u.role === 'DEPARTMENT_HEAD').length}`,
        date_creation: '',
        derniere_modification: '',
        nombre_requetes: `Total requêtes: ${formattedData.reduce((acc, user) => acc + user.nombre_requetes, 0)}`
    });

    // Style pour la ligne de statistiques
    statsRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'DBEAFE' } // Bleu très clair
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    // Génération et téléchargement du fichier Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob(
            [buffer],
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        );
        saveAs(blob, `export_utilisateurs_${new Date().toLocaleDateString('fr-FR')}.xlsx`);
    });
};