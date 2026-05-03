namespace BackEnd.DTOs
{
    public class EmployeeDashboardDto
    {
        public decimal TotalEquityGranted { get; set; } // Sum of Total_Units from Awards
        public decimal ExercisedEsopUnits { get; set; } // Approved ESOP exercise units
        public decimal VestedRsuUnits { get; set; } // Vested RSU units
        public decimal Fmv { get; set; } // Fair Market Value
        public decimal ShareValue { get; set; } // (Exercised ESOP + Vested RSU) * FMV
    }
}