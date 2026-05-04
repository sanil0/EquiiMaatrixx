import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

interface LegalSection {
  id: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-legal-notices',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './legal-notices.component.html',
  styleUrls: ['./legal-notices.component.css']
})
export class LegalNoticesComponent {
  expandedSection: string | null = null;

  legalSections: LegalSection[] = [
    {
      id: 'terms',
      title: 'Terms of Service',
      content: `By accessing and using EquiMatrix, you agree to be bound by these Terms of Service. EquiMatrix is provided "as is" without warranties of any kind. Users must maintain confidentiality of their login credentials and are responsible for all activities occurring under their account. Unauthorized access to the platform is prohibited. EquiMatrix reserves the right to modify, suspend, or terminate services at any time. Users agree not to use the platform for illegal purposes or to violate any applicable laws. All disputes shall be governed by applicable law and resolved through appropriate legal channels.`
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      content: `EquiMatrix collects and processes personal data including name, email, employee ID, and equity award information. This data is used solely for providing equity management services, tax calculations, and compliance reporting. We implement industry-standard security measures to protect your information. Data is not shared with third parties without explicit consent, except as required by law. Users have the right to access, correct, or request deletion of their personal data in accordance with applicable privacy laws including GDPR and CCPA. For detailed privacy practices, please contact our Privacy Team at privacy&#64;equimatrix.com.`
    },
    {
      id: 'disclaimers',
      title: 'Tax & Financial Disclaimers',
      content: `EquiMatrix provides tax calculations and financial estimates for informational purposes only. These calculations are not professional tax advice and should not be relied upon as such. Tax implications vary based on individual circumstances, jurisdiction, and applicable laws. Users should consult with qualified tax professionals or CPAs for advice specific to their situation. EquiMatrix does not guarantee the accuracy of tax estimates and is not liable for errors or omissions. Market prices and valuations provided are for reference only and may not reflect actual trading prices. Past performance does not guarantee future results. Users assume all risks associated with equity transactions.`
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      content: `To the fullest extent permitted by law, EquiMatrix and its owners, employees, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or revenue, arising from or related to the use of the platform, even if advised of the possibility of such damages. The total liability of EquiMatrix for any claims arising out of or related to these terms or the use of the platform shall not exceed the amount of fees paid by the user in the past 12 months. Some jurisdictions do not allow the limitation or exclusion of liability, so these limitations may not apply.`
    },
    {
      id: 'intellectual',
      title: 'Intellectual Property',
      content: `All content, features, and functionality of EquiMatrix, including but not limited to text, graphics, logos, images, code, and software, are the exclusive property of EquiMatrix or its content suppliers and are protected by international copyright, trademark, and other intellectual property laws. Users are granted a limited, non-exclusive license to access and use the platform for their personal equity management purposes. Any unauthorized reproduction, modification, or distribution of platform content is strictly prohibited and may result in legal action.`
    },
    {
      id: 'compliance',
      title: 'Compliance & Regulatory',
      content: `EquiMatrix is designed to comply with applicable securities laws, tax regulations, and employment laws in the jurisdictions where it operates. However, compliance requirements vary by jurisdiction and award type. Companies using EquiMatrix are responsible for ensuring their equity programs comply with all applicable laws and regulations. EquiMatrix does not provide legal advice and users should consult with qualified legal counsel regarding their specific compliance obligations. We maintain audit logs and reporting capabilities to support regulatory requirements including SOX compliance and SEC regulations.`
    },
    {
      id: 'warranties',
      title: 'Service Warranties & SLA',
      content: `EquiMatrix strives to maintain 99.5% platform availability excluding scheduled maintenance. We maintain industry-standard security measures and regular data backups. However, we do not guarantee uninterrupted service or that all errors will be corrected. Users acknowledge that internet connectivity disruptions, data transmission errors, or third-party service interruptions may occur. EquiMatrix is not responsible for any loss, damage, or corruption of data resulting from circumstances beyond our control. In the event of data loss, our liability is limited to assisting in recovery efforts using available backup systems.`
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      content: `EquiMatrix reserves the right to modify these legal notices and terms at any time. Changes become effective upon posting to the platform. Users will be notified of material changes via email. Continued use of the platform following notification of changes constitutes acceptance of the updated terms. If you do not agree to the updated terms, you must discontinue use of the platform. It is your responsibility to review these terms periodically for updates.`
    }
  ];

  constructor(private auth: AuthService, private router: Router) {}

  backToDashboard(): void {
    const role = this.auth.getUserRole();

    if (role === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'Employee') {
      this.router.navigate(['/employee']);
    } else {
      this.router.navigate(['/']);
    }
  }

  toggleSection(id: string): void {
    this.expandedSection = this.expandedSection === id ? null : id;
  }
}
