//------------------------------------------------------------------------------
// <auto-generated>
//     Ce code a été généré à partir d'un modèle.
//
//     Des modifications manuelles apportées à ce fichier peuvent conduire à un comportement inattendu de votre application.
//     Les modifications manuelles apportées à ce fichier sont remplacées si le code est régénéré.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WebApplication4.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Tarification_Ressource
    {
        public long ID { get; set; }
        public long FK_Ressource { get; set; }
        public long FK_Tarification { get; set; }
    
        public virtual Tarification Tarification { get; set; }
        public virtual Ressource Ressource { get; set; }
    }
}
