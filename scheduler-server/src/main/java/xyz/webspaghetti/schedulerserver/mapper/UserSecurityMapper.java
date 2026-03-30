package xyz.webspaghetti.schedulerserver.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import xyz.webspaghetti.schedulerserver.entity.Role;
import xyz.webspaghetti.schedulerserver.entity.User;
import xyz.webspaghetti.schedulerserver.security.CustomUserDetails;

@Mapper(componentModel = "spring")
public interface UserSecurityMapper {

    // Tell MapStruct to map the 'roles' list from the User to the 'authorities' list in CustomUserDetails
    @Mapping(source = "roles", target = "authorities")
    CustomUserDetails toCustomUserDetails(User user);

    // Provide a custom translation for Role -> GrantedAuthority (MapStruct will automatically use this method when iterating over the roles list)
    default GrantedAuthority mapRoleToAuthority(Role role) {
        if (role == null) {
            return null;
        }
        return new SimpleGrantedAuthority(role.getName());
    }
}
