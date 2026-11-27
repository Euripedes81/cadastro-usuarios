using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class UsuarioRepository : EfRepository<Usuario>, IUsuarioRepository
    {      
        public UsuarioRepository(UsuarioDbContext context)
        : base(context)
        {
        }
        public async Task<Usuario?> FazerLogin(Usuario usuario)        
            => await _dbSet.SingleOrDefaultAsync(u => u.Email == usuario.Email);
        

        public override async Task<ICollection<Usuario>> ObterTodosAsync()       
            => await _dbSet.Include(u => u.PerfilUsuario).ToListAsync();

        public override async Task<Usuario?> ObterPorIdAsync(int id)
            => await _dbSet.Include(u => u.PerfilUsuario).SingleOrDefaultAsync(u => u.Id == id);

        public override async Task AtualizarAsync(Usuario usuario)
        {
            var usuarioExistente = await  _dbSet.FindAsync(usuario.Id);

            usuarioExistente!.Nome = usuario.Nome;
            usuarioExistente!.Email = usuario.Email;

            if (!string.IsNullOrEmpty(usuario.Senha))
            {
                usuarioExistente!.Senha = usuario.Senha;
            }

            if (usuario.PerfilUsuarioId != 0)
            {
                usuarioExistente!.PerfilUsuarioId = usuario.PerfilUsuarioId; 
            }
            usuarioExistente!.Inativo = usuario.Inativo;
            
            await _context.SaveChangesAsync();           
                      
        }

    }
}