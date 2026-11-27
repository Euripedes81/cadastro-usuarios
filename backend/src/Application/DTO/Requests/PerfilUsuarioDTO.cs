using System.ComponentModel.DataAnnotations;

namespace Application.DTO.Requests
{
    public class PerfilUsuarioDTO
    {
        [Required]
        [Range(1, 100, ErrorMessage = "O Id deve ser maior que zero.")]
        public int Id { get; set; }
    }
}
